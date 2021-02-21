import { Arg, Mutation, Resolver } from 'type-graphql';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { UserModel } from '../entity/User';
import { AuthInput } from '../types/AuthInput';
import { UserResponse } from '../types/UserResponse';

@Resolver()
export class AuthResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg('input') { email, password }: AuthInput
  ): Promise<UserResponse> {
    // 1. Check if user exist
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error('email alrady in use');
    }

    // 2. Create new user with hashed password

    const hashedPasswords = await bcrypt.hash(password, 10);
    const user = new UserModel({ email, password: hashedPasswords });
    await user.save();

    // 3. Store user id on the token payload

    const payload = {
      id: user.id,
    };

    const token = jwt.sign(payload, process.env.SESSION_SECRET || 'jdjdjjd');

    return { user, token };
  }

  // Login part

  @Mutation(() => UserResponse)
  async login(
    @Arg('input') { email, password }: AuthInput
  ): Promise<UserResponse> {
    // 1. Check if user exist
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      throw new Error('User does not exists');
    }

    // 2. Check if password is valid
    const valid = await bcrypt.compare(password, existingUser.password);

    if (!valid) {
      throw new Error('Invalid Login');
    }

    // 3. Store user id on the token payload

    const payload = {
      id: existingUser.id,
    };

    const token = jwt.sign(
      payload,
      process.env.SESSION_SECRET || 'somecoolsecret'
    );

    return { user: existingUser, token };
  }
}
