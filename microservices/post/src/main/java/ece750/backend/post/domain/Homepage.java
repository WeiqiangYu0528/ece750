package ece750.backend.post.domain;

import java.util.List;

public class Homepage {
    private List<Post> postList;
    private List<Searchbody> recomment_follow_list;

    public Homepage(List<Post> postList, List<Searchbody> recomment_follow_list){
        this.postList = postList;
        this.recomment_follow_list = recomment_follow_list;
    }

    public List<Post> getPostList() {
        return postList;
    }

    public void setPostList(List<Post> postList) {
        this.postList = postList;
    }

    public List<Searchbody> getRecomment_follow_list() {
        return recomment_follow_list;
    }

    public void setRecomment_follow_list(List<Searchbody> recomment_follow_list) {
        this.recomment_follow_list = recomment_follow_list;
    }
}
