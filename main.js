


const Home = {
  template: "<div><h1>EX-ZAR</h1><p>Projek Blog Sederhana</div>"
};

const apiUrl = "data.json";


var Post = {
  template:
    '<div class="row"><div class="row"><div class="symbol"><h1>{{this.symbol}}</h1><h2>{{this.name}}</h2></div></div><div class="row"><p v-html="this.summary"></p></div> <div class="row  element__data"><p><b>Discovered by</b> <span v-html="this.discovered_by"></span></p></div> <div class="row  element__data"><p><b>Named by</b> <span v-html="this.named_by">N/A</span></p></div> <div class="row  element__data"><p><b>Atomic Mass</b> <span v-html="this.atomic_mass"></span></p></div> <div class="row  element__data"><p><b>Category</b> <span v-html="this.category"></span></p></div></div>',

  //post methods
  methods: {
    //get single post
    getSingle: function(id) {
      var self = this;
      this.id = this.$route.params.id;
      axios
        .get(this.baseUrl, {
          params: {
            id: this.id,
          }
        })
        .then(response => {
          this.post = response.data[id - 1];
          this.name = this.post.name;
          this.symbol = this.post.symbol;
          this.summary = this.post.summary;
          this.atomic_mass = this.post.atomic_mass;
          this.discovered_by = this.post.discovered_by;
          this.named_by = this.post.named_by;
          this.category = this.post.category;
          console.log("You clicked " + this.name + " ID# " + id);
        })
        .catch(response => {
          console.log(error);
        });
    }
  },
  //post methods

  //post data
  data() {
    return {
      baseUrl: apiUrl,
      posts: [],
      search: '',
      name: this.name
    };
  },

  //post created
  created() {
    this.getSingle(this.$route.params.id);
  },

  watch: {
    "$route.params": {
      handler(newValue) {
        const { id } = newValue;
        this.getSingle(id);
      },
      immediate: true
    }
  }
};
//post

//router
const router = new VueRouter({
  routes: [
    { path: "/", component: Home },
    { 
      path: "/post/:id", 
      
      component: Post }
  ]
});

//START APP
var app = new Vue({
  el: "#app",
  //Add router to app
  router: router,
  //DATA START
  data: {
    //Set the base URL variable for the data / Json API
    baseUrl: apiUrl,
    //set initial empty data array as name posts
    posts: [],
    //Set number of posts
    countOfPage: 40,
    //Set start page
    currPage: 1,
    //Set initial filter_name variable for text search
    filter_name: ""
  },
  //DATA END
  
  
  //COMPUTED PROPERTIES START - Computed properties are called everytime there is a mutation / change to the data ie; when a search is performed or a filter is applied the computed properties/functions will run
  computed: {
    
    //CP START - filteredNames / returns all posts with names(coverted to lower case) corresponding to the text search terms
    filteredNames: function() {
      var filter_name = this.filter_name.toLowerCase();
      return this.filter_name.trim() !== ""
        ? this.posts.filter(function(d) {
            return d.name.toLowerCase().indexOf(filter_name) > -1;
          })
        : this.posts;
    },
    //CP END - filteredNames 
    
    //CP START - pageStart / Resets the returned posts new position on the start page
    pageStart: function() {
      return (this.currPage - 1) * this.countOfPage;
    },
    //CP END - pageStart 
    
    //CP START - totalPage / Resets the number of total pages needed for the pagination
    totalPage: function() {
      return Math.ceil(this.filteredNames.length / this.countOfPage);
    }
    //CP END - totalPage 
    
  },
  //COMPUTED PROPERTIES END 
  
  //METHODS START - Methods are functions performed by actions using handlers ie buttons or returned functions that can be performed onload, mounted, or mutated within a computed property etc
  methods: {
    
    //get single
    getSingle() {},
    
    //sort by name
    sortNames() {
      this.posts = _.orderBy(this.posts, ["name"], ["asc"]);
    },

    //sort by symbol
    sortSymbols() {
      this.posts = _.orderBy(this.posts, ["symbol"], ["asc"]);
    },
    
    //sort category
    sortCategories() {
      this.posts = _.orderBy(this.posts, ["category"], ["asc"]);
    },

    //set number of pages
    setPage: function(idx) {
      if (idx <= 0 || idx > this.totalPage) {
        return;
      }
      this.currPage = idx;
    },

    //init - Function/method called on mounted to pull intial data array
    init() {
      axios.get(this.baseUrl).then(response => {
        this.posts = response.data;
      });
      
      //initial data return
      return this.posts;
    }
  },
 //METHODS END
  
  //START MOUNTED - run method/function named init
  mounted() {
    this.init();
  }
  //END MOUNTED
  
});



//import MyHeader from './components/Header.vue'
//import MyFooter from './components/Footer.vue'

//END APP
