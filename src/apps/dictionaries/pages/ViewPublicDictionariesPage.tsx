import { AppState } from '../../../redux'
import { retrievePublicDictionariesLoadingSelector } from '../redux'
import { connect } from 'react-redux'
import { retrievePublicDictionariesAction } from '../redux/actions'
import { ViewDictionariesPage } from '../components'
import { PUBLIC_DICTIONARIES_ACTION_INDEX } from '../redux/constants'

const mapStateToProps = (state: AppState) => ({
  loading: retrievePublicDictionariesLoadingSelector(state),
  dictionaries: state.dictionaries.dictionaries[PUBLIC_DICTIONARIES_ACTION_INDEX]?.items,
  meta: state.dictionaries.dictionaries[PUBLIC_DICTIONARIES_ACTION_INDEX]?.responseMeta
});

const mapDispatchToProps = {
  retrieveDictionaries: retrievePublicDictionariesAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewDictionariesPage);
