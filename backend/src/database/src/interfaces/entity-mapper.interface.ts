export interface IEntityMapper<TModel, TEntity> {
  toEntity(model: TModel): TEntity;
  toModel(entity: TEntity): TModel;
}
