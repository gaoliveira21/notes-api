import * as yup from 'yup';
import Collection from '../models/Collection';
import User from '../models/User';

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
      attributes: ['id', 'title'],
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
      ],
    });

    return response.json(collections);
  }

  async store(request, response) {
    const schema = yup.object().shape({
      title: yup.string().required(),
    });

    await schema.validate(request.body).catch((err) =>
      response.status(400).json({
        success: false,
        error: err.name,
        details: err.errors,
      })
    );

    const { title } = request.body;
    const { userId: user_id } = request;

    const { id } = await Collection.create({
      title,
      user_id,
    });

    return response.status(201).json({ id, title });
  }

  async update(request, response) {
    const schema = yup.object().shape({
      title: yup.string().required(),
    });

    await schema.validate(request.body).catch((err) =>
      response.status(400).json({
        success: false,
        error: err.name,
        details: err.errors,
      })
    );

    const { id } = request.params;
    const { title } = request.body;
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
    });

    return response.json({ id, title });
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
