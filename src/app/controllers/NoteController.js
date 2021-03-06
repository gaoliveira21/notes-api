import Note from '../models/Note';
import Collection from '../models/Collection';

import Cache from '../../libs/Cache';

class NoteController {
  async index(request, response) {
    const { page = 1, limit = 10 } = request.query;
    const { id: collection_id } = request.params;
    const { userId: user_id } = request;

    const cached = await Cache.get(
      `user:${user_id}:collection:${collection_id}:notes:${page}`
    );

    if (cached) {
      return response.json(cached);
    }

    const collection = await Collection.findOne({
      where: {
        id: collection_id,
        user_id,
      },
    });

    if (!collection) {
      return response.status(404).json({
        success: false,
        error: 'Collection not found',
      });
    }

    const notes = await Note.findAll({
      where: {
        collection_id,
      },
      limit,
      offset: (page - 1) * limit,
      attributes: ['id', 'body', 'created_at'],
      include: [
        {
          model: Collection,
          as: 'collection',
          attributes: ['id', 'title', 'color'],
        },
      ],
    });

    const totalRecords = await Note.count({
      where: {
        collection_id,
      },
    });
    const totalPages = Math.ceil(totalRecords / limit);

    await Cache.set(
      `user:${user_id}:collection:${collection_id}:notes:${page}`,
      { notes, totalRecords, totalPages }
    );

    return response.json({ notes, totalRecords, totalPages });
  }

  async store(request, response) {
    const { body } = request.body;
    const { id: collection_id } = request.params;
    const { userId: user_id } = request;

    const collection = await Collection.findOne({
      where: {
        id: collection_id,
        user_id,
      },
    });

    if (!collection) {
      return response.status(404).json({
        success: false,
        error: 'Collection not found',
      });
    }

    const notes = await Note.create({
      body,
      collection_id,
    });

    await Cache.invalidatePreffix(
      `user:${user_id}:collection:${collection_id}:notes`
    );

    return response.status(201).json(notes);
  }
}

export default new NoteController();
