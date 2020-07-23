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
}

export default new CollectionController();
