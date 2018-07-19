import { Schema, SchemaDefinition, SchemaOptions } from 'mongoose';

export function CreateVirtualId(schema: Schema) {
  schema.virtual('id').get(function () {
    return this._id.toHexString();
  });
}


export class BaseSchema extends Schema {
  constructor(definition?: SchemaDefinition, options?: SchemaOptions) {
    super(definition, options);

    this.set('toJSON', {virtuals: true, versionKey: false});
    this.set('toObject', {virtuals: true, versionKey: false});

    CreateVirtualId(this);
  }
}
