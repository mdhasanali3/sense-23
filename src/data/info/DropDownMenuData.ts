import {updateActivePopupType} from '../../store/general/actionCreators';
import {PopupWindowType} from '../enums/PopupWindowType';
import {store} from '../../index';
//import { Link } from 'react-router-dom';
import Prediction from '../../prediction/Prediction';



import {AnnotationFormatType} from '../../data/enums/AnnotationFormatType';
import {ImageData, LabelName, LabelRect} from '../../store/labels/types';
import {ImageRepository} from '../../logic/imageRepository/ImageRepository';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {LabelsSelector} from '../../store/selectors/LabelsSelector';
import {XMLSanitizerUtil} from '../../utils/XMLSanitizerUtil';
import {ExporterUtil} from '../../utils/ExporterUtil';
import {GeneralSelector} from '../../store/selectors/GeneralSelector';
import {findIndex, findLast} from 'lodash';
import {ISize} from '../../interfaces/ISize';
import {NumberUtil} from '../../utils/NumberUtil';
import {RectUtil} from '../../utils/RectUtil';
import axios from 'axios';



export type DropDownMenuNode = {
    name: string
    description?: string
    imageSrc: string
    imageAlt: string
    disabled: boolean
    onClick?: () => void
    children?: DropDownMenuNode[]
}




export const DropDownMenuData: DropDownMenuNode[] = [
    {
        name: 'Actions',
        imageSrc: 'ico/actions.png',
        imageAlt: 'actions',
        disabled: false,
        children: [
            {
                name: 'Edit Labels',
                description: 'Modify labels list',
                imageSrc: 'ico/tags.png',
                imageAlt: 'labels',
                disabled: false,
                onClick: () => store.dispatch(updateActivePopupType(PopupWindowType.UPDATE_LABEL))
            },
            {
                name: 'Import Images',
                description: 'Load more images',
                imageSrc: 'ico/camera.png',
                imageAlt: 'images',
                disabled: false,
                onClick: () => store.dispatch(updateActivePopupType(PopupWindowType.IMPORT_IMAGES))
            },
            {
                name: 'Import Annotations',
                description: 'Import annotations from file',
                imageSrc: 'ico/import-labels.png',
                imageAlt: 'import-labels',
                disabled: false,
                onClick: () => store.dispatch(updateActivePopupType(PopupWindowType.IMPORT_ANNOTATIONS))
            },
            {
                name: 'Export Annotations',
                description: 'Export annotations to file',
                imageSrc: 'ico/export-labels.png',
                imageAlt: 'export-labels',
                disabled: false,
                onClick: () => store.dispatch(updateActivePopupType(PopupWindowType.EXPORT_ANNOTATIONS))
            },
            {
                name: 'Save Annotations',
                description: 'save annotations to server',
                imageSrc: 'ico/save-labels.png',
                imageAlt: 'save-labels',
                disabled: false,
                onClick: () => {
                    RectLabelsExporter.save_annotation()
                }
                    
                //store.dispatch(updateActivePopupType(PopupWindowType.SAVE_ANNOTATIONS))
            },
            {
                name: 'Load AI Model',
                description: 'Load our pre-trained annotation models',
                imageSrc: 'ico/ai.png',
                imageAlt: 'load-ai-model',
                disabled: false,
                onClick :() => store.dispatch(updateActivePopupType(PopupWindowType.LOAD_AI_MODEL))
                
            },
        ]
    },
    {
        name: 'Community',
        imageSrc: 'ico/plant.png',
        imageAlt: 'community',
        disabled: false,
        children: [
            {
                name: 'Documentation',
                description: 'Read more about Make Sense',
                imageSrc: 'ico/documentation.png',
                imageAlt: 'documentation',
                disabled: false,
                onClick: () => window.open('https://skalskip.github.io/make-sense', '_blank')
            },
            {
                name: 'Bugs and Features',
                description: 'Report a bug or propose a new feature',
                imageSrc: 'ico/bug.png',
                imageAlt: 'bug',
                disabled: false,
                onClick: () => window.open('https://github.com/SkalskiP/make-sense/issues', '_blank')
            },
            {
                name: 'prediction',
                imageSrc: 'ico/prediction.png',
                imageAlt: 'prediction',
                disabled: false,
                onClick: () => window.open('prediction','_blank')
        //'<Link to="/signup" >Sign up</Link>'
            }
        ]
    }
]


export class RectLabelsExporter {
    public static save_annotation(): void {
       
                RectLabelsExporter.saveAsYOLO();
    }         

    private static saveAsYOLO(): void {
        const zip = new JSZip();
        LabelsSelector.getImagesData()
            .forEach((imageData: ImageData) => {
                const fileContent: string = RectLabelsExporter.wrapRectLabelsIntoYOLO(imageData);
                if (fileContent) {
                    const fileName : string = imageData.fileData.name.replace(/\.[^/.]+$/, '.txt');

                    const imageName : string = imageData.fileData.name.replace(/\.[^/.]+$/, '.jpg');

                    try {
                        zip.file(fileName, fileContent);
                        zip.file(imageName, imageData.fileData);
                    } catch (error) {
                        // TODO
                        throw new Error(error as string);
                    }
                }
            });

        try {
            zip.generateAsync({type:'blob'})
                .then((content: Blob) => {
                    //saveAs(content, `${ExporterUtil.getExportFileName()}.zip`);
                    axios.post('http://localhost:5000/save_annotation', `${ExporterUtil.getExportFileName()}.zip`)
                    .then(res => console.log(res,' image & label zip res of axios'))
                    .catch(err => console.warn(err,'error from image label zip'))
                });
        } catch (error) {
            // TODO
            throw new Error(error as string);
        }
    }

    public static wrapRectLabelIntoYOLO(labelRect: LabelRect, labelNames: LabelName[], imageSize: ISize): string {
        const snapAndFix = (value: number) => NumberUtil.snapValueToRange(value,0, 1).toFixed(6)
        const classIdx: string = findIndex(labelNames, {id: labelRect.labelId}).toString()
        const rectCenter = RectUtil.getCenter(labelRect.rect)
        const rectSize = RectUtil.getSize(labelRect.rect)
        const rawBBox: number[] = [
            rectCenter.x / imageSize.width,
            rectCenter.y / imageSize.height,
            rectSize.width / imageSize.width,
            rectSize.height / imageSize.height
        ]

        let [x, y, width, height] = rawBBox.map((value: number) => parseFloat(snapAndFix(value)))

        if (x + width / 2 > 1) { width = 2 * (1 - x) }
        if (x - width / 2 < 0) { width = 2 * x }
        if (y + height / 2 > 1) { height = 2 * (1 - y) }
        if (y - height / 2 < 0) { height = 2 * y }

        const processedBBox = [x, y, width, height].map((value: number) => snapAndFix(value))

        return [classIdx, ...processedBBox].join(' ')
    }

    private static wrapRectLabelsIntoYOLO(imageData: ImageData): string {
        if (imageData.labelRects.length === 0 || !imageData.loadStatus)
            return null;

        const labelNames: LabelName[] = LabelsSelector.getLabelNames();
        const image: HTMLImageElement = ImageRepository.getById(imageData.id);
        const imageSize: ISize = {width: image.width, height: image.height}
        const labelRectsString: string[] = imageData.labelRects.map((labelRect: LabelRect) => {
            return RectLabelsExporter.wrapRectLabelIntoYOLO(labelRect, labelNames, imageSize)
        });
        return labelRectsString.join('\n');
    }
}