import React from 'react'
import './ShowLogPopup.scss'
import {GenericYesNoPopup} from "../GenericYesNoPopup/GenericYesNoPopup";
import {
    updateActiveImageIndex,
    updateActiveLabelNameId,
    updateFirstLabelCreatedFlag,
    updateImageData,
    updateLabelNames
} from "../../../store/labels/actionCreators";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {ImageData, LabelName} from "../../../store/labels/types";
import {PopupActions} from "../../../logic/actions/PopupActions";
import {ProjectData} from "../../../store/general/types";
import {updateProjectData} from "../../../store/general/actionCreators";

interface IProps {
    updateActiveImageIndex: (activeImageIndex: number) => any;
    updateActiveLabelNameId: (activeLabelId: string) => any;
    updateLabelNames: (labelNames: LabelName[]) => any;
    updateImageData: (imageData: ImageData[]) => any;
    updateFirstLabelCreatedFlag: (firstLabelCreatedFlag: boolean) => any;
    updateProjectData: (projectData: ProjectData) => any;
}

const ShowLogPopup: React.FC<IProps> = (props) => {
//const {/*updateActiveLabelNameId*/} = props;

    const renderContent = () => {
        return(
            <div className="ShowLogPopupContent">
                <div className="Message">
                    Training log will be shown here.
                </div>
            </div>
        )
    };

    const onReject = () => {
        PopupActions.close();
    };

    return(
        <GenericYesNoPopup
            title={"Alert"}
            renderContent={renderContent}
            acceptLabel={"Exit"}
            skipAcceptButton={true}
            rejectLabel={"Okay"}
            onReject={onReject}
        />)
};

const mapDispatchToProps = {
    updateActiveLabelNameId,
    updateLabelNames,
    updateProjectData,
    updateActiveImageIndex,
    updateImageData,
    updateFirstLabelCreatedFlag
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ShowLogPopup);
