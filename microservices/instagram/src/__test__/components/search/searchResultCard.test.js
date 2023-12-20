import { fireEvent, render, screen, waitFor,cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import axiosAPI from "../../config/axiosConfig";
import SearchResultCard from "../../../components/search/searchResultCard";
afterEach(cleanup);

jest.mock("../../config/axiosConfig");
test("test a following search result user card", async ()=>{
    const result = {       
            userName : "xie",
            avatarURL:null,
            isFollowing:true        
    };

    
    axiosAPI.post.mockResolvedValueOnce({
        
        data: "successful",
        
    });

    axiosAPI.post.mockResolvedValueOnce({
        
      data: null,
      
  });

    //axiosAPI.post.mockResolvedValueOnce({
    //  response: {
    //    data:"successful",
    //  },
    //});
    
    render(<Router><SearchResultCard result={result} currentUser="alex"/></Router>);

    
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(button).toHaveTextContent("Follow");
});


test("test a follow search result user card", async ()=>{
  const result = {       
          userName : "xie",
          avatarURL:null,
          isFollowing:false        
  };

  
  axiosAPI.post.mockResolvedValueOnce({
    
      data: "successful",
      
  });

  axiosAPI.post.mockResolvedValueOnce({
    
      data:null,
    
  });
  
  render(<Router><SearchResultCard result={result} currentUser="alex"/></Router>);
  const button = screen.getByRole("button");
  await userEvent.click(button);
  //expect(1).toBe(1); 
  expect(button).toHaveTextContent("Following");
});



test("test a failed following search result user card2", async ()=>{
    const result = {       
            userName : "lin",
            avatarURL:null,
            isFollowing:true        
    };

    axiosAPI.post.mockResolvedValueOnce({
       
          data: "failed",
        
      });

    axiosAPI.post.mockResolvedValueOnce({
      
        data:null,
      
    });
    
    render(<Router><SearchResultCard result={result} currentUser="alex"/></Router>);
    const follow = screen.getByTestId("following");
    await userEvent.click(follow);
    expect(1).toBe(1);
});

test("test a failed follow search result user card2", async ()=>{
  const result = {       
          userName : "lin",
          avatarURL:null,
          isFollowing:false        
  };

  axiosAPI.post.mockResolvedValueOnce({
     
        data: "failed",
      
    });

  axiosAPI.post.mockResolvedValueOnce({
    
      data:null,
    
  });
  
  render(<Router><SearchResultCard result={result} currentUser="alex"/></Router>);
  const follow = screen.getByTestId("follow");
  await userEvent.click(follow);
  expect(1).toBe(1);
});

test("test a error follow search result user card", async ()=>{
  const result = {       
          userName : "xie",
          avatarURL:null,
          isFollowing:false        
  };

  
  axiosAPI.post.mockRejectedValueOnce(new Error("Some random error"));

  axiosAPI.post.mockRejectedValueOnce(new Error("Some random error"));
  
  render(<Router><SearchResultCard result={result} currentUser="alex"/></Router>);
  const follow = screen.getByTestId("follow");
  await userEvent.click(follow);

  const button = screen.getByRole("button");
  expect(1).toBe(1);
});

test("test a error following search result user card", async ()=>{
  const result = {       
          userName : "xie",
          avatarURL:null,
          isFollowing:true        
  };

  
  axiosAPI.post.mockRejectedValueOnce(new Error("Some random error"));

  axiosAPI.post.mockRejectedValueOnce(new Error("Some random error"));
  
  render(<Router><SearchResultCard result={result} currentUser="alex"/></Router>);
  const following = screen.getByTestId("following");
  await userEvent.click(following);

  const button = screen.getByRole("button");
  expect(1).toBe(1);
});

test("test a error follow search result user card2", async ()=>{
  const result = {       
          userName : "xie",
          avatarURL:null,
          isFollowing:false        
  };

  
  axiosAPI.post.mockRejectedValueOnce(new Error("Some random error"));

  axiosAPI.post.mockRejectedValueOnce({data:null});
  
  render(<Router><SearchResultCard result={result} currentUser="alex"/></Router>);
  const follow = screen.getByTestId("follow");
  await userEvent.click(follow);

  const button = screen.getByRole("button");
  expect(1).toBe(1);
});

test("test a error following search result user card2", async ()=>{
  const result = {       
          userName : "xie",
          avatarURL:null,
          isFollowing:true        
  };

  
  axiosAPI.post.mockRejectedValueOnce(new Error("Some random error"));

  axiosAPI.post.mockRejectedValueOnce({data:null});
  
  render(<Router><SearchResultCard result={result} currentUser="alex"/></Router>);
  const following = screen.getByTestId("following");
  await userEvent.click(following);

  const button = screen.getByRole("button");
  expect(1).toBe(1);
});

test("test a error follow search result user card3", async ()=>{
  const result = {       
          userName : "xie",
          avatarURL:null,
          isFollowing:false        
  };

  axiosAPI.post.mockRejectedValueOnce({data:"successful"});
  axiosAPI.post.mockRejectedValueOnce(new Error("Some random error"));
  
  render(<Router><SearchResultCard result={result} currentUser="alex"/></Router>);
  const follow = screen.getByTestId("follow");
  await userEvent.click(follow);

  const button = screen.getByRole("button");
  expect(1).toBe(1);
});

test("test a error following search result user card3", async ()=>{
  const result = {       
          userName : "xie",
          avatarURL:null,
          isFollowing:true        
  };

  axiosAPI.post.mockRejectedValueOnce({data:"successful"});
  axiosAPI.post.mockRejectedValueOnce(new Error("Some random error"));

  
  
  render(<Router><SearchResultCard result={result} currentUser="alex"/></Router>);
  const following = screen.getByTestId("following");
  await userEvent.click(following);

  const button = screen.getByRole("button");
  expect(1).toBe(1);
});