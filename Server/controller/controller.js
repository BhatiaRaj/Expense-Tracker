const model=require('../models/model');

//post:http://localhost:8080/api/categories
//to store the data

async function create_Categories(req,res){
    const Create = new model.Categories({
        type: "Investment",
        color: "#FCBE44",//dark
    })

    await Create.save(function(err){
        if (!err) return res.json(Create);
        return res.status(400).json({ message : `Error while creating categories ${err}`});
    })
}

// get: https://localhost:8080/api/categories
async function get_Category(req, res) {
    let data = await model.Categories.find({})
    return res.json(data);
}

//post: https://localhost:8080/api/transactions
async function create_Transaction(req, res) {

    if(!req.body) return res.status(400).json("Port HTTP Data not Provoded");
    let{name,type,amount}=req.body;

    const Create = await new model.Transaction(
        {
            name,
            type,
            amount,
            date: new Date()
        }
    );

    Create.save(function(err){
        if(!err) return res.json(Create);
        return res.status(400).json({ message : `Error while creating transaction ${err}`});
    })
}

//  get: http://localhost:8080/api/transactions
async function get_Transaction(req, res){
    let data = await model.Transaction.find({});
    return res.json(data);
}

//  delete: http://localhost:8080/api/transactions
async function delete_Transaction(req, res){
    if (!req.body) res.status(400).json({ message: "Request body not Found"});
    await model.Transaction.deleteOne(req.body, function(err){
        if(!err) res.json("Record Deleted...!");
    }).clone().catch(function(err){ res.json("Error while deleting Transaction Record")});
}

//  get: http://localhost:8080/api/labels
async function get_Labels(req, res){

    model.Transaction.aggregate([
        {
            $lookup : {
                from: "categories",
                localField: 'type',
                foreignField: "type",
                as: "categories_info"
            }
        },
        {
            $unwind: "$categories_info"
        }
    ]).then(result => {
        let data = result.map(v => Object.assign({}, { _id: v._id, name: v.name, type: v.type, amount: v.amount, color: v.categories_info['color']}));
        res.json(data);
    }).catch(error => {
        res.status(400).json("Looup Collection Error");
    })

}

module.exports={
    create_Categories,
    get_Category,
    create_Transaction,
    get_Transaction,
    delete_Transaction,
    get_Labels
}