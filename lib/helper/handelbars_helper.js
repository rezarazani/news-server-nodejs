const {normal_type , employee_type , managers_type} = require('../config/config');

module.exports = {
	plussOne : function(index , current , limit){
		// if(current == 1){
		// 	return  ((index + 1) * current ) ;
		// }else{
		// 	return  ((limit * (current -1)) + (index +1)) ;
		// }		
		return (index +1);
	},
	checkType : function(type){
		type = parseInt(type);
		if(type == managers_type) return 'مدیر' ;
		else if(type == employee_type) return 'کارمند' ;		
		else if(type == normal_type) return 'عادی' ;		

	},
	checkCategory : function(category){
		if(category == 'nahadNews') return 'اخبار نهاد' ;
		else if (category == 'uniNews') return 'اخبار دانشگاه' ;
		else if (category == 'activities') return 'فعالان عرصه فرهنگی' ;
		else if (category == 'multiMedia') return 'نشریه صوتی و تصویری' ;
		else if (category == 'book') return 'معرفی کتاب' ;
		else if (category == 'all') return 'همه اخبار' ;
		else if (category == 'brothers') return 'برادران' ;
		else if (category == 'sisters') return 'خواهران' ;

	},
	select : function (selected , options) {
		return options.fn(this).replace(new RegExp(' value=\"'+selected+'\"') , '$&selected="selected"');
	},
	paginate : function (options) {
		let output = '';
		if (options.hash.current === 1){
			output += '<li class="paginate_button " disabled><a class="page-link">Frist</a></li>';
		}else {
			output += '<li class="paginate_button" ><a href="?page=1" class="page-link">Frist</a></li>';
		}

		let i = (Number(options.hash.current) > 5 ? Number(options.hash.current)-4 : 1) ;

		if (i !== 1){
			output += '<li class="paginate_button" disabled ><a  class="page-link">...</a></li>';
		}
		for ( i ; i <= (Number(options.hash.current)+4)&& i <=options.hash.pages ; i++ ){
			if (i === options.hash.current){
				output += `<li class="paginate_button  active" ><a class="page-link">${i}</a></li>`;
			}else {
				output += `<li class="paginate_button  " ><a href="?page=${i}" class="page-link">${i}</a></li>`;
			}
			if (i === Number(options.hash.current) +4  && i<options.hash.pages  ){
				output += '<li class="paginate_button  " disabled ><a class="page-link">...</a></li>';
			}
		}

		if (options.hash.current === options.hash.pages){
			output += '<li class="paginate_button " disabled ><a  class="page-link">Last</a></li>';
		} else {
			output += `<li class="paginate_button"  ><a href='?page=${options.hash.pages}' class="page-link">Last</a></li>`;
		}
		return output;
	}

	
};