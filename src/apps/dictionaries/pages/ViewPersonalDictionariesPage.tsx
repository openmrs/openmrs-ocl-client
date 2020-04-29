import { AppState } from '../../../redux'
import {
  retrievePersonalDictionariesAction,
  retrievePersonalDictionariesLoadingSelector
} from '../redux'
import { connect } from 'react-redux'
import { ViewDictionariesPage } from '../components'
import { PERSONAL_DICTIONARIES_ACTION_INDEX } from '../redux/constants'

const mapStateToProps = (state: AppState) => ({
  loading: retrievePersonalDictionariesLoadingSelector(state),
  dictionaries: state.dictionaries.dictionaries[PERSONAL_DICTIONARIES_ACTION_INDEX]?.items,
  meta: state.dictionaries.dictionaries[PERSONAL_DICTIONARIES_ACTION_INDEX]?.responseMeta
});

const mapDispatchToProps = {
  retrieveDictionaries: retrievePersonalDictionariesAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewDictionariesPage);
