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
      attributes: ['id', 'title', 'color'],
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
      ],
    });

    const totalRecords = await Collection.count();
    const totalPages = Math.ceil(totalRecords / limit);

    return response.json({ collections, totalRecords, totalPages });
  }

  async store(request, response) {
    const schema = yup.object().shape({
      title: yup.string().required(),
      color: yup
        .string()
        .matches(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color')
        .required(),
    });

    await schema.validate(request.body).catch((err) =>
      response.status(400).json({
        success: false,
        error: err.name,
        details: err.errors,
      })
    );

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

    const schema = yup.object().shape({
      title: yup.string(),
      color: yup
        .string()
        .matches(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color'),
    });

    await schema.validate(request.body).catch((err) =>
      response.status(400).json({
        success: false,
        error: err.name,
        details: err.errors,
      })
    );

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
