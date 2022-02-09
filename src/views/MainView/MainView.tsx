import React, {useState} from 'react';
import './MainView.scss';
import {TextButton} from '../Common/TextButton/TextButton';
import classNames from 'classnames';
//import {ISize} from '../../interfaces/ISize';
//import {ImageButton} from '../Common/ImageButton/ImageButton';
//import {ISocialMedia, SocialMediaData} from '../../data/info/SocialMediaData';
import {EditorFeatureData, IEditorFeature} from '../../data/info/EditorFeatureData';
import {Tooltip} from '@material-ui/core';
//import Fade from '@material-ui/core/Fade';
import withStyles from '@material-ui/core/styles/withStyles';
import ImagesDropZone from './ImagesDropZone/ImagesDropZone';
import {updateActivePopupType} from '../../store/general/actionCreators';
import { PopupWindowType } from '../../data/enums/PopupWindowType';
import {store} from '../../index';
import LoadMoreImagesPopup from '../PopupView/LoadMoreImagesPopup/LoadMoreImagesPopup';
import PopupView from '../PopupView/PopupView';
import { GenericYesNoPopup } from '../PopupView/GenericYesNoPopup/GenericYesNoPopup';


const MainView: React.FC = () => {
    const [projectInProgress, setProjectInProgress] = useState(false);
    const [projectCanceled, setProjectCanceled] = useState(false);

    const startProject = () => {
        setProjectInProgress(true);
    };

    const endProject = () => {
        setProjectInProgress(false);
        setProjectCanceled(true);
    };

    const getClassName = () => {
        return classNames(
            'MainView', {
                'InProgress': projectInProgress,
                'Canceled': !projectInProgress && projectCanceled
            }
        );
    };

    const DarkTooltip = withStyles(theme => ({
        tooltip: {
            backgroundColor: '#171717',
            color: '#ffffff',
            boxShadow: theme.shadows[1],
            fontSize: 11,
            maxWidth: 120
        },
    }))(Tooltip);
    
    /*const getSocialMediaButtons = (size:ISize) => {
        return SocialMediaData.map((data:ISocialMedia, index: number) => {
            return <DarkTooltip
                key={index}
                disableFocusListener={true}
                title={data.tooltipMessage}
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                placement='left'
            >
                <div>
                    <ImageButton
                        buttonSize={size}
                        image={data.imageSrc}
                        imageAlt={data.imageAlt}
                        href={data.href}
                    />
                </div>
            </DarkTooltip>
        });
    };*/

    const getEditorFeatureTiles = () => {
        return EditorFeatureData.map((data:IEditorFeature) => {
            return <div
                className='EditorFeaturesTiles'
                key={data.displayText}
            >
                <div
                    className='EditorFeaturesTilesWrapper'
                >
                    <img
                        draggable={false}
                        alt={data.imageAlt}
                        src={data.imageSrc}
                    />
                    <div className='EditorFeatureLabel'>
                        {data.displayText}
                    </div>
                </div>
            </div>
        });
    };

    return (
        <div className={getClassName()}>

            <div className='LeftColumn'>
                <div className={'LogoWrapper'}>
                    <img
                        draggable={false}
                        alt={'main-logo'}
                        src={'ico/sense.png'}
                    />
                </div>
                
                {!projectInProgress && <TextButton
                    label={'Train'}
                    onClick= {() => store.dispatch(updateActivePopupType(PopupWindowType.ALERT_PROJECT))}
                    externalClassName={'get-started-button'}
                />}

                {!projectInProgress && <TextButton
                    label={'Predict'}
                    onClick={() => store.dispatch(updateActivePopupType(PopupWindowType.ALERT_PROJECT))}
                    externalClassName={'get-started-button'}
                />}

                {projectInProgress && <TextButton
                    label={'Go Back'}
                    onClick={endProject}
                />}
            </div>

            <div className='RightColumn'>
                <ImagesDropZone/>
                {!projectInProgress && <TextButton
                    label={'Upload Image'}
                    onClick={startProject}
                    externalClassName={'get-started-button'}
                />}
            </div>
        </div>
    );
};

export default MainView;
function renderContent(): React.ReactNode {
    throw new Error('Function not implemented.');
}

