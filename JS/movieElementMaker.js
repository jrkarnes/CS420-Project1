/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function movieElementMaker(template){
    this.template = template;
};
movieElementMaker.prototype.getHtml = function(values){
    var html = "";//to hold the html code that will be generated
    if($.isArray(values))//if the data is an array
        for (var i = 0; i < values.length; ++i) {//iterte throught the array
            html+=this.get_html_unrepeated(values[i]);//add each item in the arry to the html code
        }
    else//if its not an array 
        html=this.get_html_unrepeated(values);//simply make html code for the single object

    return html;
    
};

movieElementMaker.prototype.get_html_unrepeated=function(values){
    var html=this.template;
            for (var key in values){
                if ($.isArray(values[key])) 
                    html= this.replace_Block(key, values[key],html);
                else{ 
                    var re = new RegExp("{{" + key + "}}", 'g');//define the key term we are looking to replace with actual data
                    if(values[key]==true)//if the value of the key being looked at is true
                    {
                        html=html.replace(re,"<img src='Data/Icons/HD.png'>")//replace the key hd with the image
                    }
                    else if(values[key]<=5)//if the key has a value of less than 5(which should only be ratings
                    {
                        var numStars= values[key];
                        var stars = "";
                        while(numStars > 0)
                        {
                            stars+="<span><img src='Data/Icons/gold_star.png'></span>";
                            --numStars;
                        }
                        html = html.replace(re,stars);//will replace the key rating with the variable stars, which should be a string of span statements
                    }
                    else
                    {
                        html = html.replace(re,values[key]);//replace the generic key term with the objects value at said key
                    }    
                }
            }
            return html;
};

//i don't think we need this, let me know what you think, if not i will go through and delete this and references to it
////the parameters are used for a repetitive a block
movieElementMaker.prototype.replace_Block = function (block_name, values,template) {
    var block_start_text = "{{#block " + block_name + "}}";
    var block_end_text = "{{#end block " + block_name + "}}";
    var start_index = template.search(block_start_text) + block_start_text.length;
    var end_index = template.search(block_end_text);
    var block = template.substring(start_index, end_index);
    template = template.substring(0, start_index) + template.substring(end_index, template.length - 1);
    if (block.length > 0) {
        var blocks = "";
        var html_maker=new htmlMaker(block);
        blocks=html_maker.getHTML(values);
        template= template.replace(block_start_text, blocks);
        template = template.replace(block_end_text, "");
        }
    return template;
};

movieElementMaker.prototype.getResults = function(searchKey,values){
    var html = "";
    if($.isArray(values)){//if the data is an array
        for (var i = 0; i < values.length; ++i) {//iterte throught the array
            if(this.checkMatch(values[i],searchKey)){
                html+=this.get_html_unrepeated(values[i]);//add each item in the arry to the html code
            }
        }
    }
    else if(this.checkMatch(values,searchKey)){
        html+=this.get_html_unrepeated(values);
    }
    return html;
};

movieElementMaker.prototype.checkMatch=function(values,searchTerm){    
   var possMatch = values; 
    for (var key in possMatch){
        if (possMatch[key].toLowerCase().search(searchTerm.toLowerCase().trim()) != -1) //looks for stuff that contains what has been typed in
            return true;
        else
            return false;
    }
};