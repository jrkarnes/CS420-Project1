/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () { 
    var display=new Display(movies["movies"]);
});


function Display(movieData){
    this.movies = movieData;
    
    this.movies_div="#movies";
    this.gridIcon="#grid";
    this.listIcon="#list";
    this.sortOptions="#sort_options";
    this.movie_template="#movie-template";
    this.searchButton="#search";//to use for button search
    this.searchField="#search_input";
    this.suggestion_div="#suggestionBox";
    this.suggestTempalte="#suggestion-template";
    
    var self = this;
    var MakeGallery_function=function(){
        self.MakeGallery.call(self);
    };
    
    var MakeList_function=function(){
        self.MakeList.call(self);
    };
    
    var MovieSort=function(){
        self.MovieSort.call(self);
    };
    
    var Search_function=function(){
        self.Search.call(self);
    };
    
    var LiveSearch_function=function(){
        self.LiveSearch.call(self);
    };
    $(this.suggestion_div).hide();
    $(this.gridIcon).on("click", MakeGallery_function);
    $(this.listIcon).on("click", MakeList_function);
    $(this.searchButton).on("click",Search_function);
    $(this.searchField).on('keyup',LiveSearch_function);
    $(this.sortOptions).on('change', MovieSort);
    
    this.load_movies();
}

Display.prototype.load_movies = function() {
    var template=$(this.movie_template).html(); //get the template
    var movie_maker = new movieElementMaker(template); //create an html Maker
    var html = movie_maker.getHtml(this.movies); //generate dynamic HTML based on the data
    $(this.movies_div).html(html);//show the movies
};

Display.prototype.MakeGallery = function () {
    $(this.movies_div).attr("class", "gallery"); //changes the movies div to have the attributes of gallery
    $(this.gridIcon).attr("src", "Data/Icons/grid_pressed.jpg");//these lines effect what the buttons appear as
    $(this.listIcon).attr("src", "Data/Icons/list.jpg");
};

Display.prototype.MakeList = function () {
    $(this.movies_div).attr("class", "listview");//changes the movies div to have the attributes of listview
    $(this.gridIcon).attr("src", "Data/Icons/grid.jpg");//these lines effect what the buttons appear as
    $(this.listIcon).attr("src", "Data/Icons/list_pressed.jpg");
};

Display.prototype.MovieSort=function(){
    var key=$(this.sortOptions).val().toLowerCase();//make the key the sort option
    this.movies=this.movies.sort(//compare movies based on there values for that key
            function(a,b){
                if(a[key]<b[key])
                    return -1;
                if(a[key]==b[key])
                    return 0;
                if(a[key]>b[key])
                    return 1;
            }            
            );
    
    this.load_movies();
};

Display.prototype.Search = function(){
    var template = $(this.movie_template).html();
    var movie_maker = new movieElementMaker(template);
    var value = $(this.searchField).val();//get search value
    var html = movie_maker.getResults(value,this.movies);//get only the movies matching search
    $(this.movies_div).html(html);//display those movies   
};

Display.prototype.LiveSearch = function(){
    var showSuggestions=false;
    var template =$(this.suggestTempalte).html();
    var suggest_maker = new movieElementMaker(template);
    var value = $(this.searchField).val();//get value of the search
    var html = suggest_maker.getResults(value,this.movies);//get search results    
    if(value != "")//to only show suggestion box if there is a value in the field
    {
        //var html = suggest_maker.getResults(value,this.movies); //moved this
        if(html != "")//makes sure there is stuff to display
        {
            showSuggestions=true;
        }
        if(showSuggestions)//if there is stuff to display
        {
            $(this.suggestion_div).html(html);
            $(this.suggestion_div).children(".suggestions").on('click',function(){//suggestions is the clickable suggestion
                var suggestion=$(this).attr('id');
                $("#search_input").val(suggestion);//plop the selected movie's title into the search field
                $("#suggestionBox").hide();//then hide that suggestion box
            });
            $(this.suggestion_div).show();
        }
        else//if nothing to display
            $(this.suggestion_div).hide();
    }
    else//hide if no value in the field
        $(this.suggestion_div).hide();
};
