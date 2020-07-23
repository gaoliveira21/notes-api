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
}

export default new CollectionController();
