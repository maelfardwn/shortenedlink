import React, { Component } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import randomString from 'randomstring'

import Moment from 'react-moment';


export const StyledHome = styled.div`
  width: 100%;
  border-radius: 10px;
  margin: 15px 0;
  
  .input-field {  
    width: 100%;
    padding: 10px 18px;
    outline: none;
    cursor:  'pointer';
    font-weight: bold;

    color:black;
    resize: none;
  }

  input, textarea {
    background: lightgrey;
    border: none;
    outline: none;
    
  }
  `


export default class HomePage extends Component {

    constructor(props) {
        super(props)
        
    this.handleMouseHover = this.handleMouseHover.bind(this);
        this.state = {
            link:'',
            addedLink:'',
            addedShortenedLink:'',
            shortenedLink:'',
            redirectCount:'',
            startSeenDate:'',
            lastSeenDate:'',
            differenceTime:'',
            data: [], 
            isHovering: false,
        }
      }

      handleMouseHover() {
        this.setState(this.toggleHoverState);
      }
    
      toggleHoverState(state) {
        return {
          isHovering: !state.isHovering,
        };
      }
    async componentDidMount(){
      let shortLink =''
          

        if(window.sessionStorage.getItem("link")!= null && window.sessionStorage.getItem("link")!='' &&
        window.sessionStorage.getItem("shortedLink")!= null && window.sessionStorage.getItem("shortedLink")!='')
        {
          this.setState({link: window.sessionStorage.getItem("link").split(',')})
         await this.setState({data: window.sessionStorage.getItem("data")})
         
          }else{
              this.setState({shortenedLink:[]})
              this.setState({link:[]})
          }
          if(this.state.addedShortenedLink==''){
              this.setState({addedShortenedLink:randomString.generate({
                charset: 'alphabetic',
                capitalization :'lowercase',
                length: 7,
              })})
          }
          console.log(window.sessionStorage.getItem("link"))
    }
    onChangeText = (stateName, value) => {
        this.setState({ [stateName]: value });
      };
      
    submitShorten = async () =>{

        let  differentTime = ''
        let start;
        let last;
        let a =  randomString.generate({
            charset: 'alphabetic',
            capitalization :'lowercase',
            length: 7,
          })
        this.setState({addedShortenedLink: a})
console.log('addedshortenedLink' +this.state.addedShortenedLink)
        const options = {
            headers: {'Content-Type ': 'application/json'}
          };
       await axios.post('http://localhost:8080/short', {
            url: this.state.addedLink,
            shortcode: a
          },
          )
          .then((response) => {
            console.log('generate short'+a)
          
  
            this.setState({addedShortenedLink: response.data.shortcode})

            console.log('res post'+response);
          }, (error) => {
            console.log(error);
          });
         await axios.get(` http://localhost:8080/`+a,{
            headers: {
               'Content-Type': 'application/json'
            }})
          .then(resp => {
            console.log('resp '+ resp)
             start = resp.data.startDate.substring(0,19)
            this.setState({redirectCount:resp.data.redirectCount})
          this.setState({startSeenDate:start})
            if(resp.data.lastSeenDate){
              
             last = resp.data.lastSeenDate.substring(0,19)
          this.setState({lastSeenDate:last})
          }else{
            
          this.setState({lastSeenDate:'last'})
          }
          })

        let result ;
        let resultShortedLink;
        const addedLinkTmp = this.state.addedLink
        if(this.state.link && this.state.shortenedLink){
           
            resultShortedLink = [...this.state.shortenedLink,this.state.addedShortenedLink]

            result = [...this.state.link, this.state.addedLink]
            this.setState({link: result})
            
            this.setState({shortenedLink:resultShortedLink})
           await this.setState({addedLink:''}, function () {
            this.setState({link : [...result]})
            this.setState({shortedLink: [...resultShortedLink]})
          })
         
        }else{
             
            resultShortedLink = [...this.state.shortenedLink,this.state.addedShortenedLink]
          
            result = this.state.addedLink
            await this.setState({addedLink:''
        })

        }
        
      
        const dataTmp = {
            'ShortLinkTmp': this.state.addedShortenedLink,
            'LinkTmp':addedLinkTmp,
            'redirectCount': this.state.redirectCount,
            'startDate' :this.state.startSeenDate,
            'lastSeenDate' :this.state.lastSeenDate
        }
       await this.setState({  data: [...this.state.data, dataTmp]})
    window.sessionStorage.setItem("link",  result)
    window.sessionStorage.setItem("shortedLink",  resultShortedLink)
    console.log(this.state.data)
    window.sessionStorage.setItem("data",  dataTmp)
    }
    
    redirectOnclick = async (id,Link,index,evt) =>{
      evt.preventDefault();
      const newCountries = [...this.state.data];
      newCountries.splice(index, 1);

      this.setState(state => ({
          data: newCountries
      }),function(){

         axios.get(` http://localhost:8080/`+id,{
          headers: {
             'Content-Type': 'application/json'
          }})
        .then(resp => {
          console.log('resp '+ resp)
          const re = resp.data.redirectCount
          this.setState({redirectCount:re})
          console.log('redirect'+resp.data.redirectCount)
        this.setState({startSeenDate:start})
       
        })

      });
      let redirectTmp;
      let start;
      let last;
     await navigator.clipboard.writeText(`https://impraise-shorty.herokuapp.com/${id}`) ;
      for (let i=0;i<this.state.data.length;i++){
        if(this.state.data[i].ShortLinkTmp == id.ShortLinkTmp){
          this.setState(data => {
            let redirectCount = Object.assign({}, data.redirectCount);  // creating copy of state variable jasper
            data.redirectCount +=1;                     // update the name property, assign a new value                 
            return { data };                                 // return new object jasper object
          })
        }
      }
        let result ;
        let resultShortedLink;
        const addedLinkTmp = this.state.addedLink
        if(this.state.link && this.state.shortenedLink){
           
            resultShortedLink = [...this.state.shortenedLink,this.state.addedShortenedLink]

            result = [...this.state.link, this.state.addedLink]
            this.setState({link: result})
            
            this.setState({shortenedLink:resultShortedLink})
            this.setState({addedLink:''}, function () {
            this.setState({link : [...result]})
            this.setState({shortedLink: [...resultShortedLink]})
          })
         
        }else{
             
            resultShortedLink = [...this.state.shortenedLink,this.state.addedShortenedLink]
          
            result = this.state.addedLink
             this.setState({addedLink:''
        })

        }
        
      
        const dataTmp = {
          'ShortLinkTmp': id,
          'LinkTmp':Link,
          'redirectCount': this.state.redirectCount,
          'startDate' :this.state.startSeenDate,
          'lastSeenDate' :this.state.lastSeenDate
        }
        
       await this.setState({  data: [...this.state.data, dataTmp]})
    window.sessionStorage.setItem("link",  result)
    window.sessionStorage.setItem("shortedLink",  resultShortedLink)
    console.log(this.state.data)
    window.sessionStorage.setItem("data",  dataTmp)
      }
      Clear = ()=>{
        sessionStorage.clear()
        this.setState({data:[]})
      }
    render() {
        let arr=[];
        let lastVisits;

      let Data;
      if(this.state.data){
      Data = this.state.data && this.state.data.length>0 ? this.state.data.map((a,index)=>{
        let result
          return(
            <tr key={index}>
                <td> 
                    <Row> 
                      <div onMouseEnter={this.handleMouseHover} onMouseLeave={this.handleMouseHover}>
                        <Col lg={6}>
                          <button style={{background:'none',border:'none'}} 
                                onClick={(evt) =>{this.redirectOnclick(a.ShortLinkTmp,a.LinkTmp,index,evt)}}><p style={{fontWeight:'600px'}}> Shooooort.com/<span style={{color:'red'}}>{a.ShortLinkTmp}</span></p></button>
                        </Col>
                        <Col lg={6}> 
                           {
                             this.state.isHovering &&
                             <div >
                               <p style={{color:'red'}}>Click to copy this link </p>
                             </div>
                           }
                         </Col>   
                        </div>
                               
                    </Row>
                    <Row><p style={{color:'grey',padding:'20px'}}>{a.LinkTmp}</p></Row>
                  
                </td>
                <td>{a.redirectCount}</td>
                <td> {(a.redirectCount>0)?
                <Moment diff={a.startDate} unit="days" >{a.lastSeenDate} days ago</Moment>
                : <td>{a.startDate}</td>}</td>
            </tr>
          )
      }) : <tr>
         <td></td>
         </tr>}
      let moment =   <Moment diff="2021-06-29T08:09:27" unit="seconds" >2021-06-29T06:10:02</Moment>
      let m = parseInt(moment)

        const {link,addedLink,arrayShortenedLink,data} = this.state
        return (
            <StyledHome>
                <Row style={{margin:'0', padding:'0'}}>
                    <Col>
                        <h3 style={{color:'red',fontWeight:'700'}}><u>Shooooort</u></h3>
                    

                    </Col>
                    <Col>
                        <h6 style={{color:'grey',fontWeight:'400'}}>The Link Shortener with a long name</h6>
                    </Col>
                </Row>
                <div >
                <Row style={{margin:'0',marginBottom:'40px',padding:'0'}}>
                    <Col style={{margin:'auto'}}>
                        <input type='text' style={{padding:'15px',width:'400px',height:'50px',background:'lightgrey',borderRadius:'5px'}}  id='addedLink'  name="addedLink" 
                                            value={addedLink} onChange={(e) => this.onChangeText('addedLink', e.target.value)}/>
                    </Col>
                    <Col>
                        <button onClick={this.submitShorten} style={{background:'red',color:'white',borderRadius:'8px',border:'none',width:'150px',height:'50px'}} >Shorten this link</button>
                    </Col>
                </Row>
                </div>
              <Row>
                <Col>
                  <h3>Previously shortened by you</h3>
                </Col>
                <Col style={{display:'flex',justifyContent:'start'}}>
                  <button onClick={this.Clear} style={{background:'none',border:'none',color:'red'}}>Clear history</button>
                </Col>
              </Row>
                <Table striped bordered hover>
                 <thead>
                   <tr>
                     <th>LINK</th>
                     <th>VISITS</th>
                     <th>LAST VISITED</th>
                   </tr>
                 </thead>
                 <tbody>
                  { Data
                  } 
                 </tbody>
                </Table>
            </StyledHome>
        )
    }
}
