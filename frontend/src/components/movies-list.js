import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
const MoviesList = props => { 
  
  const [movies, setMovies] = useState([])
  const [searchTitle, setSearchTitle] = useState("")
  const [searchRating, setSearchRating] = useState("")
  const [ratings, setRatings] = useState(["All Ratings"])

  const [currentPage, setCurrentPage] = useState(0)
  const [entriesPerPage, setEntriesPerPage] = useState(0)
  const [currentSearchMode, setCurrentSearchMode] = useState("")


  useEffect(() =>{ 
    retrieveMovies()
    retrieveRatings()
  },[])

  useEffect(() =>{ 
    retrieveNextPage()
  },[currentPage])

  useEffect(() =>{ 
    setCurrentPage(0)
  },[currentSearchMode])

  const retrieveNextPage = () => {
    if(currentSearchMode === "findByTitle")
      findByTitle()
    else if(currentSearchMode === "findByRating")
      findByRating()      
    else 
      retrieveMovies()
  }

  const retrieveMovies = () =>{
    setCurrentSearchMode("")
    MovieDataService.getAll(currentPage)
      .then(response =>{
        console.log(response.data)
        setMovies(response.data.movies) 
        setCurrentPage(response.data.page)
        setEntriesPerPage(response.data.entries_per_page)

      })
      .catch( e =>{
        console.log(e)
      })
  }

  const retrieveRatings = () =>{
    MovieDataService.getRatings()
      .then(response =>{
        console.log(response.data)
 	  //start with 'All ratings' if user doesn't specify any ratings
        setRatings(["All Ratings"].concat(response.data)) 
      })
      .catch( e =>{
        console.log(e)
      })
  }  

  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value
    setSearchTitle(searchTitle);
  }

  const onChangeSearchRating = e => {
    const searchRating = e.target.value
    setSearchRating(searchRating);
  }  
 
////JSX form
  return (
    <div className="App">   
      <Container>
        <Form>        
          <Row>
            <Col>
              <Form.Group>          
                <Form.Control 
                  type="text" 
                  placeholder="Search by title" 
                  value={searchTitle} 
                  onChange={onChangeSearchTitle} 
                />
              </Form.Group>        
              <Button 
                variant="primary" 
                type="button" 
                onClick={findByTitle}
              > 
                Search         
              </Button>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control as="select" onChange={onChangeSearchRating} >
                  {ratings.map(rating =>{
                    return(
                      <option value={rating}>{rating}</option>
                    )
                  })}
                </Form.Control>       
              </Form.Group>    
              <Button 
                  variant="primary" 
                  type="button" 
                  onClick={findByRating}
              > 
              Search         
              </Button>  
            </Col>
          </Row>              
        </Form> 
    </Container>
</div>
); 
}