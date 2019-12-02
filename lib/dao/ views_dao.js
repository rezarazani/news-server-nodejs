const db = require('../utils/db');
const ViewsSchema = require('../models/views_model');

ViewsSchema.statics = {
	saveViews : function(account_type = 2){
		try {
			const views =  new this({account_type}); 
			return views.save();      
		} catch (error) {
			return error;
		}
	},
	viewsCount :  function(){
		try {
			return  this.aggregate([
				{$group : {
					_id : {  year : {$year : '$moment'} ,month : {$month : '$moment'} , day : {$dayOfMonth : '$moment'} },
					totalViews : {$sum : 1},
					date : { $first : '$moment' },
					normal : {$sum : {$cond :[{$eq : ['$account_type' , 2]},1,0] }},
					managers :{$sum : {$cond :[{$eq : ['$account_type' , 1]},1,0] }},
				}},
				{$sort : { date : 1}},
				{$project : { date : {$dateToString: { format: '%m/%d', date: '$date' }},_id : 1, totalViews : 1 , normal : 1 , managers : 1}}
			]);
		} catch (error) {
			return error;
		}
	}
};


module.exports = db.model('views', ViewsSchema);
