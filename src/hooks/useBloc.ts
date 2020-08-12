import { useEffect, useState, useContext, Context } from 'react';
import { Bloc } from '../blocs/abstractBloc';

export const useBloc = <T, B extends Bloc<T>>(context: Context<B>): [T, B] => {
  const bloc = useContext(context);
  const [state, setState] = useState(bloc.getState);

  useEffect(() => {
    const subscription = bloc.toObservable.subscribe((value) => {
      setState(value);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return [state, bloc];
};
