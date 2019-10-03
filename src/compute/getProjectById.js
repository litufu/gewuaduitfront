
export default function getProjectById(projectId,projects){
    const newprojects = projects.filter(project=>project.id === projectId)
    if(newprojects.length>0){
        return newprojects[0]
    } else{
        return {}
    }

}