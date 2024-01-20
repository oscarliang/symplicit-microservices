import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CarInput {
  @Field(() => ID, { nullable: true })
  _id: string;

  @Field()
  id: number;

  @Field()
  brand: string;

  @Field()
  name: string;

  @Field()
  price: string;

  @Field()
  drive: string;

  @Field()
  imageUrl: string;
}
