export type Context =
  | tinyapp.IPageInstance<any>
  | tinyapp.IComponentInstance<any, any>;

export type MapState<S> = () => S;
