import _ from 'lodash'


export default function computeRelationship(companyRelatedPaties,otherRelatedPaties){
    if(!otherRelatedPaties){
        return "尚未获取公司信息"
    }
    if(companyRelatedPaties.length===0){
        return "请先获取公司股东和高管信息"
    }
    if(otherRelatedPaties.length===0){
        return "未检查"
    }
    const companyRelatedNames = companyRelatedPaties.map(relatedParty=>relatedParty.name)
    const otherRelatedNames = otherRelatedPaties.map(relatedParty=>relatedParty.name)
    const intersectionRelatedNames = _.intersection(companyRelatedNames,otherRelatedNames)
    if(intersectionRelatedNames.length===0){
        return "未发现关联关系"
    }else{
        for(let relatedName of intersectionRelatedNames){
            const companyRelatedPaty = companyRelatedPaties.filter(relatedParty=>relatedParty.name===relatedName)[0]
            const otherRelatedPaty = otherRelatedPaties.filter(relatedParty=>relatedParty.name===relatedName)[0]
            // 交集为个人
            if(companyRelatedPaty.type==="非公司" && otherRelatedPaty.type==="非公司"){
                if(companyRelatedPaty.relationship==="公司高管" && otherRelatedPaty.relationship==="公司高管"){
                    return  `有共同的高管${companyRelatedPaty.name}`
                }else if((companyRelatedPaty.relationship==="公司高管") && (otherRelatedPaty.relationship.indexOf("控股股东")!==-1)){
                    return  `公司高管${companyRelatedPaty.name}是该公司控股股东`
                }else if(companyRelatedPaty.relationship==="公司高管" && (otherRelatedPaty.relationship.indexOf("持股股东")!==-1)){
                    return `公司高管${companyRelatedPaty.name}是该公司持股股东`
                }else if((companyRelatedPaty.relationship.indexOf("控股股东")!==-1) && otherRelatedPaty.relationship==="公司高管"){
                    return `公司控股股东${companyRelatedPaty.name}是该公司高管`
                }else if((companyRelatedPaty.relationship.indexOf("控股股东")!==-1) && otherRelatedPaty.relationship.indexOf("控股股东")!==-1){
                    return "受同一控制人控制的公司"
                }else if((companyRelatedPaty.relationship.indexOf("控股股东")!==-1) && otherRelatedPaty.relationship.indexOf("持股股东")!==-1){
                    return `公司控股股东${companyRelatedPaty.name}是该公司持股股东`
                }else if((companyRelatedPaty.relationship.indexOf("持股股东")!==-1) && otherRelatedPaty.relationship.indexOf("控股股东")!==-1){
                    return `公司持股股东${companyRelatedPaty.name}是该公司控股股东`
                }else if((companyRelatedPaty.relationship.indexOf("持股股东")!==-1) && otherRelatedPaty.relationship.indexOf("持股股东")!==-1){
                    return `公司持股股东${companyRelatedPaty.name}是该公司持股股东`
                }else if((companyRelatedPaty.relationship.indexOf("持股股东")!==-1) && otherRelatedPaty.relationship.indexOf("公司高管")!==-1){
                    return `公司持股股东${companyRelatedPaty.name}是该公司高管`
                }
            }else{
                // 交集为公司
                if(companyRelatedPaty.grade===0){
                    if(otherRelatedPaty.grade===1){
                        if(otherRelatedPaty.relationship.indexOf("控股股东")!==-1){
                            return "子公司"
                        }else if(otherRelatedPaty.relationship.indexOf("持股股东")!==-1){
                            return _.replace(otherRelatedPaty.relationship,"股东","公司")
                        }else{
                            throw Error("关联关系错误")
                        }
                    }else{
                        if(otherRelatedPaty.relationship.indexOf("控股股东")!==-1){
                            return `${otherRelatedPaty.grade}级子公司`
                        }else if(otherRelatedPaty.relationship.indexOf("持股股东")!==-1){
                            return _.replace(otherRelatedPaty.relationship,"股东",`${otherRelatedPaty.grade}级公司`)
                        }else{
                            throw Error("关联关系错误")
                        }
                    }
                }else if(companyRelatedPaty.grade===1){
                    if(otherRelatedPaty.grade===0){
                        if(companyRelatedPaty.relationship.indexOf("控股股东")!==-1){
                            return "母公司"
                        }else if(companyRelatedPaty.relationship.indexOf("持股股东")!==-1){
                            return otherRelatedPaty.relationship
                        }else{
                            throw Error("关联关系错误")
                        }
                    }else{
                        if((companyRelatedPaty.relationship.indexOf("控股股东")!==-1)&&
                        (otherRelatedPaty.relationship.indexOf("控股股东")!==-1)
                        ){
                            return "受同一控制方控制的子公司"
                        }else{
                            return `公司的${companyRelatedPaty.grade}级${companyRelatedPaty.relationship}是该公司的${otherRelatedPaty.grade}级${otherRelatedPaty.relationship}`
                        }
                    }
                }else{
                    if(otherRelatedPaty.grade===0){
                        if(companyRelatedPaty.relationship.indexOf("控股股东")!==-1){
                            return `${companyRelatedPaty.grade}级控股公司`
                        }else if(companyRelatedPaty.relationship.indexOf("持股股东")!==-1){
                            return `${companyRelatedPaty.grade}级持股股东`
                        }else{
                            throw Error("关联关系错误")
                        }
                    }else{
                        if((companyRelatedPaty.relationship.indexOf("控股股东")!==-1)&&
                        (otherRelatedPaty.relationship.indexOf("控股股东")!==-1)
                        ){
                            return "受同一控制方控制的子公司"
                        }else{
                            return `公司的${companyRelatedPaty.grade}级${companyRelatedPaty.relationship}是该公司的${otherRelatedPaty.grade}级${otherRelatedPaty.relationship}`
                        }
                    }
                }
            }
        }
    }
    
}
