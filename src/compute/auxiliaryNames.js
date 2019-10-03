
export default function auxiliaryNames(auxiliaries){
    const auxiliaryNames = auxiliaries.map(auxiliary=>
        `${auxiliary.type_name}_${auxiliary.name}`
        )
    return auxiliaryNames
}