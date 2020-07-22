import { useHistory } from 'react-router-dom';

import { LinkType } from '../../interfaces/link';
import { toLinkURLType } from '../../components/Drive/helpers';

function useNavigate() {
    const history = useHistory();

    const navigateToLink = (shareId: string, linkId: string, type: LinkType) => {
        history.push(`/drive/${shareId}/${toLinkURLType(type)}/${linkId}`);
    };

    return {
        navigateToLink,
    };
}

export default useNavigate;
