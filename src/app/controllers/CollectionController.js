import Collection from '../models/Collection';
import User from '../models/User';
import Note from '../models/Note';

class CollectionController {
  async index(request, response) {
    const { page = 1, limit = 10 } = request.query;
    const { userId: user_id } = request;

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

    const totalRecords = await Collection.count();
    const totalPages = Math.ceil(totalRecords / limit);

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

    return response.status(204).json();
  }
}

export default new CollectionController();
