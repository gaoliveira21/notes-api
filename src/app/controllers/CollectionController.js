import Collection from '../models/Collection';
import User from '../models/User';
import Note from '../models/Note';

import Cache from '../../libs/Cache';

class CollectionController {
  async index(request, response) {
    const { page = 1, limit = 10 } = request.query;
    const { userId: user_id } = request;

    const cacheKey = `user:${user_id}:collections:${page}`;
    const cached = await Cache.get(cacheKey);

    if (cached) {
      return response.json(cached);
    }

    const collections = await Collection.findAll({
      where: {
        user_id,
      },
      limit,
      offset: (page - 1) * limit,
      attributes: ['id', 'title', 'color'],
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
      ],
    });

    const totalRecords = await Collection.count({ where: { user_id } });
    const totalPages = Math.ceil(totalRecords / limit);

    await Cache.set(cacheKey, { collections, totalRecords, totalPages });

    return response.json({ collections, totalRecords, totalPages });
  }

  async show(request, response) {
    const { id } = request.params;

    const collection = await Collection.findByPk(id, {
      attributes: ['id', 'title', 'color'],
      include: [
        { model: Note, as: 'notes', attributes: ['id', 'body', 'created_at'] },
      ],
    });

    if (!collection) {
      return response
        .status(404)
        .json({ success: false, error: 'Collection not found' });
    }

    return response.json(collection);
  }

  async store(request, response) {
    const { title, color } = request.body;
    const { userId: user_id } = request;

    const { id } = await Collection.create({
      title,
      color,
      user_id,
    });

    await Cache.invalidatePreffix(`user:${user_id}:collections`);

    return response.status(201).json({ id, title, color });
  }

  async update(request, response) {
    if (Object.keys(request.body).length === 0) {
      return response.status(400).json({
        success: false,
        error: 'No body sent',
      });
    }

    const { id } = request.params;
    const { title, color } = request.body;
    const { userId: user_id } = request;

    const collection = await Collection.findOne({
      where: {
        id,
        user_id,
      },
    });

    if (!collection) {
      return response.status(404).json({
        success: false,
        error: 'Collection not found',
      });
    }

    await collection.update({
      title,
      color,
    });

    await Cache.invalidatePreffix(`user:${user_id}:collections`);

    return response.json({
      id: collection.id,
      title: collection.title,
      color: collection.color,
    });
  }

  async delete(request, response) {
    const { id } = request.params;
    const { userId: user_id } = request;

    const collection = await Collection.findOne({
      where: {
        id,
        user_id,
      },
    });

    if (!collection) {
      return response.status(404).json({
        success: false,
        error: 'Collection not found',
      });
    }

    await collection.destroy();

    await Cache.invalidatePreffix(`user:${user_id}:collections`);

    return response.status(204).json();
  }
}

export default new CollectionController();
