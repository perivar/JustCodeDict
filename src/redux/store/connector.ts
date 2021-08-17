import { connect, ConnectedProps } from 'react-redux';
import { AppDispatch, RootState } from './store';

const mapDispatch = (dispatch: AppDispatch) => {
  return { dispatch };
};

const mapState = (state: RootState) => {
  return {
    ui: state.ui,
    page: state.page,
  };
};

// use by class components to connect to Redux instead of connect
export const connector = connect(mapState, mapDispatch);

// use by class components to get the redux props
// example:
// type Props = PropsFromRedux & {
//    param1: string;
// };
export type PropsFromRedux = ConnectedProps<typeof connector>;
