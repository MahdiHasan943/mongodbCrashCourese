const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnect")

module.exports.getAllService =async (req, res,next)=>{
  
    try {
        const db = getDb();
        const service = req.body;
        const result = await db.collection("test").find().limit(10).toArray();
        console.log(result);
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        next(error)
    }

    
}

module.exports.getToolDetail = async (req, res, next) => {
    try {
      const db = getDb();
      const { id } = req.params;
  
      if(!ObjectId.isValid(id)){
        return res.status(400).json({ success: false, error: "Not a valid tool id."});
      }
  
      const service = await db.collection("test").findOne({_id: ObjectId(id)});
  
      if(!service){
        return res.status(400).json({ success: false, error: "Couldn't find a tool with this id"});
      }
  
      res.status(200).json({ success: true, data: service });
      
    } catch (error) {
      next(error);
    }
  };
  

module.exports.saveAService =async (req, res, next) => {
    try {     

        const db = getDb();

        const service = req.body;

        const result = await db.collection("test").insertOne(service)
        if (!result.insertedId) {
            res.status(400).send({status:false,error:"somthing wrong"})
        }
     
            res.send(`service add with id ${result.insertedId}`)
        
        console.log(result);
        
    }
    catch (error) {
        next(error)
    }
    
  

}

module.exports.updateTool = async (req, res, next) => {
    try {
      const db = getDb();
      const { id } = req.params;
  
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "Not a valid tool id." });
      }
  
      const tool = await db.collection("test").updateOne({ _id: ObjectId(id) }, { $set: req.body });
  
      if (!tool.modifiedCount) {
        return res.status(400).json({ success: false, error: "Couldn't update the tool" });
      }
  
      res.status(200).json({ success: true, message: "Successfully updated the tool" });
    } catch (error) {
      next(error);
    }
  };
  
  module.exports.deleteTool = async (req, res, next) => {
    try {
      const db = getDb();
      const { id } = req.params;
  
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "Not a valid tool id." });
      }
  
      const tool = await db.collection("test").deleteOne({ _id: ObjectId(id) });
  
      if (!tool.deletedCount) {
        return res.status(400).json({ success: false, error: "Couldn't delete the tool" });
      }
  
      res.status(200).json({ success: true, message: "Successfully deleted the tool" });
    } catch (error) {
      next(error);
    }
  };
  module.exports.test = async(req, res, next) => {
    for (let i = 0; i < 100000; i++) {
      const db = getDb();
      db.collection("tests").insertOne({name: `tests ${i}`, age: i });
    }
  };
  module.exports.testGet = async(req, res, next) => {
    const db = getDb();
  
    const result = await db.collection("tests").find({ name: "tests 99999" }).toArray();
    res.json(result);
  };