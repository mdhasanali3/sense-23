import React , { useEffect, useState } from 'react';
import './TopNavigationBar.scss';
import StateBar from '../StateBar/StateBar';
import {PopupWindowType} from '../../../data/enums/PopupWindowType';
import {AppState} from '../../../store';
import {connect} from 'react-redux';
import {updateActivePopupType, updateProjectData} from '../../../store/general/actionCreators';
import TextInput from '../../Common/TextInput/TextInput';
import {ImageButton} from '../../Common/ImageButton/ImageButton';
import {Settings} from '../../../settings/Settings';
import {ProjectData} from '../../../store/general/types';
import DropDownMenu from './DropDownMenu/DropDownMenu';
import { TextButton } from '../../Common/TextButton/TextButton';
import axios, {AxiosResponse} from 'axios'
import { result } from 'lodash';
import { losses } from '@tensorflow/tfjs';
import { store } from '../../..';

interface IProps {
    updateActivePopupTypeAction: (activePopupType: PopupWindowType) => any;
    updateProjectDataAction: (projectData: ProjectData) => any;
    projectData: ProjectData;
}

const TopNavigationBar: React.FC<IProps> = (props) => {
    //const [projectintrain, setprojectintrain] = useState(false);
    const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        event.target.setSelectionRange(0, event.target.value.length);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
            .toLowerCase()
            .replace(' ', '-');

        props.updateProjectDataAction({
            ...props.projectData,
            name: value
        })
    };
    
    const onChangee = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
            .toLowerCase()
            .replace(' ', '-');


        props.updateProjectDataAction({
            ...props.projectData,
            epoch: value,
            
        })
       
    };
    const onChangeb = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
            .toLowerCase()
            .replace(' ', '-');


        props.updateProjectDataAction({
            ...props.projectData,
            batch:value,
            
        })
       
    };
 

    const closePopup = () => props.updateActivePopupTypeAction(PopupWindowType.EXIT_PROJECT)

    return (
        <div className='TopNavigationBar'>
            <StateBar/>
            <div className='TopNavigationBarWrapper'>
                <div className='NavigationBarGroupWrapper'>
                    <div
                        className='Header'
                        onClick={closePopup}
                    >
                        Sense-23
                    </div>
                </div>
                <div className='NavigationBarGroupWrapper'>
                    <DropDownMenu/>
                </div>
                
                <div className='NavigationBarGroupWrapper middle'>
                    <div className='ProjectName'>Project Name :</div>
                    <TextInput
                        isPassword={false}
                        value={props.projectData.name}
                        onChange={onChange}
                        onFocus={onFocus}
                    />
                    <div className='EPOCH'>EPOCH : </div>
                    <TextInput
                        isPassword={false}
                        value={props.projectData.epoch}
                        onChange={onChangee}
                        onFocus={onFocus}
                    />
                    <div className='BATCH'>BATCH : </div>
                    <TextInput
                        isPassword={false}
                        value={props.projectData.batch}
                        onChange={onChangeb}
                        onFocus={onFocus}
                    />
                    <TextButton
                    label={'Start Training'}
                    onClick={() => 
                         {
                          console.log(props.projectData,' the projectdata')
                          axios.post('http://35.184.91.84:5000/hyperparameter', props.projectData)
                                      .then(res => {
                                          
                                        console.log(res.data[1]['eopch'],res.data[10]['precision'],res.data[10]['recall'],'hyperparameter json res')
                                       
                                        store.dispatch(updateActivePopupType(PopupWindowType.SHOW_LOG))
                                      })
                                      .catch(err => console.warn(err,'hyperparameter error '))

                       
                      }
                        
                    }
                    externalClassName={'start-training-button'}
                    
                    />
                </div>
                <div className='NavigationBarGroupWrapper'>
                    <ImageButton
                        image={'ico/github-logo.png'}
                        imageAlt={'github-logo.png'}
                        buttonSize={{width: 30, height: 30}}
                        href={Settings.GITHUB_URL}
                    />
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = {
    updateActivePopupTypeAction: updateActivePopupType,
    updateProjectDataAction: updateProjectData
};

const mapStateToProps = (state: AppState) => ({
    projectData: state.general.projectData
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopNavigationBar);
