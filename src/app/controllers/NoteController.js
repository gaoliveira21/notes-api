import * as yup from 'yup';
import Note from '../models/Note';
import Collection from '../models/Collection';

class NoteController {
  async index(request, response) {
    const { page = 1, limit = 10 } = request.query;
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

    const totalRecords = await Note.count();
    const totalPages = Math.ceil(totalRecords / limit);

    return response.json({ notes, totalRecords, totalPages });
  }

  async store(request, response) {
    const schema = yup.object().shape({
      body: yup.string().required().max(1024),
    });

    await schema.validate(request.body).catch((err) =>
      response.status(400).json({
        success: false,
        error: err.name,
        details: err.errors,
      })
    );

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

    return response.status(201).json(notes);
  }
}

export default new NoteController();
