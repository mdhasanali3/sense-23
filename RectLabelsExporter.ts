import {AnnotationFormatType} from '../../data/enums/AnnotationFormatType';
import {ImageData, LabelName, LabelRect} from '../../store/labels/types';
import {ImageRepository} from '../imageRepository/ImageRepository';
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
import YAML from 'yaml' ;
import fs,{writeFile} from 'fs' ;



export class RectLabelsExporter {
    
    
    public static export(exportFormatType: AnnotationFormatType): void {
        switch (exportFormatType) {
            case AnnotationFormatType.YOLO:
                RectLabelsExporter.exportAsYOLO();
                break;
            case AnnotationFormatType.VOC:
                RectLabelsExporter.exportAsVOC();
                break;
            case AnnotationFormatType.CSV:
                RectLabelsExporter.exportAsCSV();
                break;
            default:
                return;
        }
    }

    private static exportAsYOLO(): void {
        const zip = new JSZip();
        let a1=0,a2=0,a3=0,b1=0,b2=0,b3=0,c1=0,c2=0,c3=0,ra=0,rb=0,rc=0
                //const yaml = new YAML();
        LabelsSelector.getImagesData()
            .forEach((imageData: ImageData) => {
                const fileContent: string = RectLabelsExporter.wrapRectLabelsIntoYOLO(imageData);
                if (fileContent) {
                //     const fileName : string = imageData.fileData.name.replace(/\.[^/.]+$/, '.txt');
                //   //  console.log('imgdata labelnameid ',imageData.labelNameIds)
                //     const imageName : string = imageData.fileData.name.replace(/\.[^/.]+$/, '.jpg');
	let lines= fileContent.split('\n')
    let fileName='',imageName=''
    if(fileContent.length>44){
            //console.log("iam line 0 ",,lines[1][0],"iam line i ",ii)
        let r=lines[0][0]
        if(r>'2'&& r<'6')
        {
                        fileName  = `r_pro_b(${rb}).txt`;
                        //  console.log('imgdata labelnameid ',imageData.labelNameIds)
                         imageName  = `r_pro_b(${rb}).png`;
        rb++
        }
        else if(r>'5')
        {
                         fileName = `r_pro_c(${rc}).txt`;
                        //  console.log('imgdata labelnameid ',imageData.labelNameIds)
                         imageName = `r_pro_c(${rc}).png`;
        rc++
        }
        else
        {
                         fileName  = `r_pro_a(${ra}).txt`;
                        //  console.log('imgdata labelnameid ',imageData.labelNameIds)
                         imageName  = `r_pro_a(${ra}).png`;
        ra++
        }
    }
    else{
                if(fileContent[0]=='0')
            {          fileName  = `pro_a1(${a1}).txt`;
                            //  console.log('imgdata labelnameid ',imageData.labelNameIds)
                             imageName  = `pro_a1(${a1}).png`;
                    
                //console.log("iam 0 ",fileContent[0],fileContent.length,"iam i ",ii)
                
                                a1++;
            }
                else if(fileContent[0]=='1')
            {          fileName = `pro_a2(${a2}).txt`;
                            //  console.log('imgdata labelnameid ',imageData.labelNameIds)
                             imageName  = `pro_a2(${a2}).png`;
                    
                //console.log("iam 0 ",fileContent[0],fileContent.length,"iam i ",ii)
                
                                a2++;
            }

                else if(fileContent[0]=='2')
            {          fileName = `pro_a3(${a3}).txt`;
                            //  console.log('imgdata labelnameid ',imageData.labelNameIds)
                             imageName  = `pro_a3(${a3}).png`;
                    
                //console.log("iam 0 ",fileContent[0],fileContent.length,"iam i ",ii)
                
                                a3++;
            }

                else if(fileContent[0]=='3')
            {          fileName  = `pro_b1(${b1}).txt`;
                            //  console.log('imgdata labelnameid ',imageData.labelNameIds)
                         imageName  = `pro_b1(${b1}).png`;
                    
                //console.log("iam 0 ",fileContent[0],fileContent.length,"iam i ",ii)
                
                                b1++;
            }


                else if(fileContent[0]=='4')
            {         fileName  = `pro_b2(${b2}).txt`;
                            //  console.log('imgdata labelnameid ',imageData.labelNameIds)
                            imageName  = `pro_b2(${b2}).png`;
                    
                //console.log("iam 0 ",fileContent[0],fileContent.length,"iam i ",ii)
                
                                b2++;
            }


                else if(fileContent[0]=='5')
            {          fileName  = `pro_b3(${b3}).txt`;
                            //  console.log('imgdata labelnameid ',imageData.labelNameIds)
                            imageName  = `pro_b3(${b3}).png`;
                    
                //console.log("iam 0 ",fileContent[0],fileContent.length,"iam i ",ii)
                
                                b3++;
            }



                else if(fileContent[0]=='6')
            {         fileName = `pro_c1(${c1}).txt`;
                            //  console.log('imgdata labelnameid ',imageData.labelNameIds)
                         imageName  = `pro_c1(${c1}).png`;
                    
                //console.log("iam 0 ",fileContent[0],fileContent.length,"iam i ",ii)
                
                                c1++;
            }


                else if(fileContent[0]=='7')
            {          fileName  = `pro_c2(${c2}).txt`;
                            //  console.log('imgdata labelnameid ',imageData.labelNameIds)
                         imageName = `pro_c2(${c2}).png`;
                    
                //console.log("iam 0 ",fileContent[0],fileContent.length,"iam i ",ii)
                
                                c2++;
            }


                else if(fileContent[0]=='8')
            {          fileName = `pro_c3(${c3}).txt`;
                            //  console.log('imgdata labelnameid ',imageData.labelNameIds)
                             imageName  = `pro_c3(${c3}).png`;
                    
                //console.log("iam 0 ",fileContent[0],fileContent.length,"iam i ",ii)
                
                                c3++;
            }



            }



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
        const labelNames: LabelName[] = LabelsSelector.getLabelNames();
        
        const yamlData = {
            train: '../train/images',
            val: '../valid/images',
            nc: labelNames.length,
            names: [],
        } 
              
        for(let i=0;i<yamlData['nc'];i++)
        {
            yamlData['names'].push(labelNames[i].name)
        }

       let doc =JSON.stringify(yamlData)
       //console.log('yaml ',yamlData)

//        const da = YAML.stringify(doc);
//        fs.writeFile('outpu.yaml', da);
// console.log("da ",outpu.yaml)

        try {
            zip.file('data.json', doc);
            
        } catch (error) {
            // TODO
            throw new Error(error as string);
        }

            zip.generateAsync({type:'blob'})
                .then((content: Blob) => {
                     saveAs(content, `${ExporterUtil.getExportFileName()}.zip`);
                });
        } catch (error) {
            // TODO
            throw new Error(error as string);
        }
    }

    public static wrapRectLabelIntoYOLO(labelRect: LabelRect, labelNames: LabelName[], imageSize: ISize): string {
        const snapAndFix = (value: number) => NumberUtil.snapValueToRange(value,0, 1).toFixed(6)
        const classIdx: string = findIndex(labelNames, {id: labelRect.labelId}).toString()
       // console.log('class id  ',classIdx)
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

        //console.log('1 labelnames names in',labelNames.name,labelNames.length)
        //console.log('2 labelnames names',labelNames)

        const image: HTMLImageElement = ImageRepository.getById(imageData.id);
        const imageSize: ISize = {width: image.width, height: image.height}
        const labelRectsString: string[] = imageData.labelRects.map((labelRect: LabelRect) => {
            return RectLabelsExporter.wrapRectLabelIntoYOLO(labelRect, labelNames, imageSize)
        });
        return labelRectsString.join('\n');
    }

    private static exportAsVOC(): void {
        const zip = new JSZip();
        LabelsSelector.getImagesData().forEach((imageData: ImageData) => {
                const fileContent: string = RectLabelsExporter.wrapImageIntoVOC(imageData);
                if (fileContent) {
                    const fileName : string = imageData.fileData.name.replace(/\.[^/.]+$/, '.xml');
                    try {
                        zip.file(fileName, fileContent);
                    } catch (error) {
                        // TODO
                        throw new Error(error as string);
                    }
                }
            });

        try {
            zip.generateAsync({type:'blob'})
                .then(function(content) {
                    saveAs(content, `${ExporterUtil.getExportFileName()}.zip`);
                });
        } catch (error) {
            // TODO
            throw new Error(error as string);
        }
    }

    private static wrapRectLabelsIntoVOC(imageData: ImageData): string {
        if (imageData.labelRects.length === 0 || !imageData.loadStatus)
            return null;

        const labelNamesList: LabelName[] = LabelsSelector.getLabelNames();
        const labelRectsString: string[] = imageData.labelRects.map((labelRect: LabelRect) => {
            const labelName: LabelName = findLast(labelNamesList, {id: labelRect.labelId});
            const labelFields = !!labelName ? [
                `\t<object>`,
                `\t\t<name>${labelName.name}</name>`,
                `\t\t<pose>Unspecified</pose>`,
                `\t\t<truncated>0</truncated>`,
                `\t\t<difficult>0</difficult>`,
                `\t\t<bndbox>`,
                `\t\t\t<xmin>${Math.round(labelRect.rect.x)}</xmin>`,
                `\t\t\t<ymin>${Math.round(labelRect.rect.y)}</ymin>`,
                `\t\t\t<xmax>${Math.round(labelRect.rect.x + labelRect.rect.width)}</xmax>`,
                `\t\t\t<ymax>${Math.round(labelRect.rect.y + labelRect.rect.height)}</ymax>`,
                `\t\t</bndbox>`,
                `\t</object>`
            ] : [];
            return labelFields.join('\n')
        });
        return labelRectsString.join('\n');
    }

    private static wrapImageIntoVOC(imageData: ImageData): string {
        const labels: string = RectLabelsExporter.wrapRectLabelsIntoVOC(imageData);
        const projectName: string = XMLSanitizerUtil.sanitize(GeneralSelector.getProjectName());

        if (labels) {
            const image: HTMLImageElement = ImageRepository.getById(imageData.id);
            return [
                `<annotation>`,
                `\t<folder>${projectName}</folder>`,
                `\t<filename>${imageData.fileData.name}</filename>`,
                `\t<path>/${projectName}/${imageData.fileData.name}</path>`,
                `\t<source>`,
                `\t\t<database>Unspecified</database>`,
                `\t</source>`,
                `\t<size>`,
                `\t\t<width>${image.width}</width>`,
                `\t\t<height>${image.height}</height>`,
                `\t\t<depth>3</depth>`,
                `\t</size>`,
                labels,
                `</annotation>`
            ].join('\n');
        }
        return null;
    }


    private static exportAsCSV(): void {
        const content: string = LabelsSelector.getImagesData()
            .map((imageData: ImageData) => {
                return RectLabelsExporter.wrapRectLabelsIntoCSV(imageData)})
            .filter((imageLabelData: string) => {
                return !!imageLabelData})
            .join('\n');
        const fileName: string = `${ExporterUtil.getExportFileName()}.csv`;
        ExporterUtil.saveAs(content, fileName);
    }

    private static wrapRectLabelsIntoCSV(imageData: ImageData): string {
        if (imageData.labelRects.length === 0 || !imageData.loadStatus)
            return null;

        const image: HTMLImageElement = ImageRepository.getById(imageData.id);
        const labelNames: LabelName[] = LabelsSelector.getLabelNames();
        const labelRectsString: string[] = imageData.labelRects.map((labelRect: LabelRect) => {
            const labelName: LabelName = findLast(labelNames, {id: labelRect.labelId});
            const labelFields = !!labelName ? [
                labelName.name,
                Math.round(labelRect.rect.x).toString(),
                Math.round(labelRect.rect.y).toString(),
                Math.round(labelRect.rect.width).toString(),
                Math.round(labelRect.rect.height).toString(),
                imageData.fileData.name,
                image.width.toString(),
                image.height.toString()
            ] : [];
            return labelFields.join(',')
        });
        return labelRectsString.join('\n');
    }
}
