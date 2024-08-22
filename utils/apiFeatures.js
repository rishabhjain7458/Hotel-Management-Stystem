class apiFeatures {
    constructor(query,queryStr){
        this.query = query
        this.queryStr = queryStr
    }

    filter(){
        let excludeFields = ['sort','page','limit','fields'];

        const queryObj = {...this.queryStr}
        // console.log({...req.query})

        excludeFields.forEach((el)=>{
            delete queryObj[el];
        })
    
        console.log(queryObj);
    
        //ADDING DOLLAR SIGN
        let queryStr1 = JSON.stringify(queryObj);
    
        queryStr1 = queryStr1.replace(/\b(gte|gt|lt|lte)\b/g,(match)=>`$${match}`)
        let queryObj2 = JSON.parse(queryStr1);
        this.query = this.query.find(queryObj2);
        return this 
        // let query = Movie.find(queryObj2);
    }
    
    sort(){
    if(this.queryStr.sort){
            const sortBy = this.queryStr.sort
            this.query = this.query.sort(sortBy)
        }
        return this
    }

    limit_fields(){
        if(this.queryStr.fields){
            const fields = this.queryStr.fields.split(',').join(" ")
            //"name duration ratings"
            console.log(this.query.fields);
            this.query = this.query.select(fields);   
    }
    return this
    }
    pagination(){
        const page = this.queryStr.page*1 || 1;
        const limit = this.queryStr.limit*1 || 10;
    
        // p-0 s-0, p-1 s-10 data-11-20, p-3 s-20 data-21-30
        const skip = (page-1)*limit;
    
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

module.exports = apiFeatures