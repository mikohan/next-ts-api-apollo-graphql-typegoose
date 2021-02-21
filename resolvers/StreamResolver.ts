import {
  Resolver,
  Query,
  Mutation,
  FieldResolver,
  Ctx,
  Arg,
  Roog,
  UserMiddleware,
} from 'type-graphql';
import { ObjectId } from 'mongodb';
import { MyContext } from '../types/MyContext';
import { User, UserModel } from '../entity/User';
import { Stream, StreamModel } from '../entity/Stream';
import { ObjectIdScalar } from '../schema/object-id.scalar';
import { StreamInput } from '../types/StreamInput';
import { isAuth } from '../middleware/isAuth';

@Resolver(() => Stream)
export class SteamResolver {
  @Query(() => Stream, { nullable: true })
  stream(@Arg('streamId', () => ObjectIdScalar) streamId: ObjectId) {
    //1. Fid a single stream
    return StreamModel.findById(streamId);
  }

  @Query(() => [Stream])
  @UserMiddleware(isAuth)
  streams(@Ctx() ctx: MyContext) {
    // 2. Display all streams for current user
    return StreamModel.find({ author: ctx.res.locals.userId });
  }

  @Mutation(() => Stream)
  @UserMiddleware(isAuth)
  async addStream(
    @Arg('input') streamInput: StreamInput,
    @Ctx() ctx: MyContext
  ): Promise<Stream> {
    // 3. Create a new user's stream
    const stream = new StreamModel({
      ...streamInput,
      author: ctx.res.locals.userId,
    } as Stream);
    await stream.save();
    return stream;
  }
}
