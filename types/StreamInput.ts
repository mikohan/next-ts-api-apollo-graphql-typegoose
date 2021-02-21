import { InputType, Field } from 'type-graphql';
import { ObjectId } from 'mongodb';

import { Stream } from '../entity/Stream';

@InputType()
export class Streaminput implements Partial<Stream> {
  @Field({ nullable: true })
  id?: ObjectId;

  @Field()
  title: string;

  @Field()
  description?: string;

  @Field()
  url: string;
}
