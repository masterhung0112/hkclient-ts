export type Dictionary<T> = {
  [key: string]: T
}

export type $ID<E extends {id: string}> = E['id'];
export type $UserID<E extends {user_id: string}> = E['user_id'];
export type RelationOneToOne<E extends {id: string}, T> = {
  [x in $ID<E>]: T;
};
export type RelationOneToMany<E1 extends {id: string}, E2 extends {id: string}> = {
  [x in $ID<E1>]: Array<$ID<E2>>;
};
export type IDMappedObjects<E extends {id: string}> = RelationOneToOne<E, E>;