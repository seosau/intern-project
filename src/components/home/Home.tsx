'use client'
import { NewPostOptions, Post, LeftSide, RightSide} from "@/components";
import { Box } from "@mui/material";
import { useState } from "react";
import { IPost } from "@/interfaces/post.interfaces";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { postApi } from "@/apis/post.api";
import { StoryComp } from "../story/StoryComp";


const getPosts = async (keyword: string = "") => {
  try{
    const res = await postApi.getAll(keyword);
    return res.data;
  } catch(err) {
      console.error('Failed to load posts!', err);
      throw err; //Nem loi de react query xu li
  }
}

export function HomeComp() {
    const [keyword, setKeyword] = useState("");
    const debouncedSearch = useDebounce(keyword, 500);
    const { data, isLoading, error} = useQuery({
      queryKey: ['allPosts', debouncedSearch],
      queryFn: () => getPosts(debouncedSearch),
      retry: 3,
      staleTime: 5*60*1000,
      gcTime: 10*60*1000,
      refetchInterval: 30*1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true
    })

  // if(isLoading) return <div>Loading...</div>
  // if(error) return <div>Error: Loading failed!!!</div>
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems={"start"}
      justifyContent={"space-between"}
      gap={2}
      width={"100%"}
      height={"100%"}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems={"center"}
        justifyContent={"center"}
        gap={2}
        width={1/4}
        height={"100%"}
        padding={2}
        flex={1}
      >
          <LeftSide keyword={keyword} onKeywordChange={setKeyword} />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems={"center"}
        justifyContent={"center"}
        gap={2}
        width={"100%"}
        height={"100%"}
        maxWidth={"47%"}
        flex={2}
      >
          <NewPostOptions />
          <StoryComp />
          {isLoading && <div>Loading...</div>}
          {error && <div>Error: Loading failed!!!</div>}
          {data && data.map((post: IPost) => (
            <Post post={post} key={post.id}/>
          ))}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems={"center"}
        justifyContent={"start"}
        gap={2}
        width={1/4}
        height={"100vh"}
        padding={2}
        flex={1}
      >
          <RightSide />
      </Box>
    </Box>
  );
}