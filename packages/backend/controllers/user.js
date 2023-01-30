import Users from '../models/users.js'

export const getAllUsers = async(req,res) => {
  try {
      const users = await Users.find({})
      return res.status(201).json({"users":users})

  } catch (error) {
      return res.status(404).json({"message":error})
  }
}

export const deleteUser = async(req,res) => {
    try {
        const {userName : userName} = req.params
        await Users.deleteOne({userName:userName});
        return res.status(201).json({"message":"Deleted Successfully"})

    } catch (error) {
        return res.status(404).json({"message":error})
    }
}

export const addUser = async(req,res) => {
    try {
        console.log("Adding a new user ",req.body)
        const user = await Users.create(req.body)
        return res.status(201).json({"newUser":user})

    } catch (error) {
        return res.status(404).json({"message":error})
    }
}

export const getUser = async(req,res) => {
    try {
        const userName = req.userName
        console.log("Get user admin called",userName)
        const user = await Users.findOne({userName:userName})
        return res.status(201).json({"user":user})

    } catch (error) {
        return res.status(404).json({message:error})
    }
}

export const updateGeneralDetails = async(req,res) => {
    try {

        const userName = req.userName
        console.log("Update general Details called",userName)

        let user = await Users.findOne({userName:userName})
        const versionIndex = (user.contentVersions).length - 1;

        const updateDetails = req.body;
        let name = updateDetails.name;
        let socialMedia = updateDetails.socialMedia;
        let caption = updateDetails.caption;
        let email = updateDetails.email;
        let phoneNumber = updateDetails.phoneNumber;
        let themeDetails = updateDetails.themeDetails;
        let publishedVersion = (user.contentVersions).length - 1

        if(name){user = await Users.updateOne({userName:userName},{'$set': { [`contentVersions.${versionIndex}.userDetails.name`] : name}},{new:true})}
        if(socialMedia){user = await Users.updateOne({userName:userName},{'$set': { [`contentVersions.${versionIndex}.userDetails.socialMedia`] : socialMedia}},{new:true})}
        if(caption){ user = await Users.updateOne({userName:userName},{'$set': { [`contentVersions.${versionIndex}.homePagePoster.caption`] : caption}},{new:true})}
        if(email){user = await Users.updateOne({userName:userName},{'$set': { [`contentVersions.${versionIndex}.contactDetails.email`] : email }},{new:true})}
        if(phoneNumber){user = await Users.updateOne({userName:userName},{'$set': { [`contentVersions.${versionIndex}.contactDetails.phoneNumber`] : phoneNumber}},{new:true})}
        if(themeDetails){user = await Users.updateOne({userName:userName},{'$set': { [`contentVersions.${versionIndex}.themeDetails`] : themeDetails}},{new:true})}
        if(publishedVersion){await Users.updateOne({userName:userName},{'$set': { [`publishedVersion`] : publishedVersion}},{new:true})}

        return res.status(201).json({"updatedUser":user});

    } catch (error) {
        console.log(error)
        return res.status(404).json({message:"Failed Update"})
    }
}

export const publishVersion = async(req,res)=>{
  try{
        const userName = req.userName
        console.log("Publish version called",userName)
        let user = await Users.findOne({userName:userName})
        let contentVersions = user.contentVersions

        contentVersions[0] = contentVersions[1]

        user = await Users.updateOne({userName:userName},{'$set': { [`contentVersions`] : contentVersions}},{new:true})
        return res.status(201).json({"updatedUser":user})

  } catch (error) {
    console.log(error)
    return res.status(404).json({message:error})
  }

}