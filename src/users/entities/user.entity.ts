import { Prop, Schema, SchemaFactory }
    from '@nestjs/mongoose';
@Schema()
export class User {

    @Prop()
    firstname: string;

    @Prop()
    lastname: string;

    @Prop()
    gender: string;

    @Prop()
    role: string;

    @Prop({ unique: true })
    email: string;

    @Prop()
    password: string;
}
export const UserSchema = SchemaFactory.createForClass(User);