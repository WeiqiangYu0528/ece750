import React,{useState} from 'react'
import Header from './header'
import Image from './image'
import Actions from './actions'
import Footer from './footer'
import Comments from './comments'
import AddComment from './add-comment'
import { postType } from './postType'
import Modal from './modal'

export default function Post(props:postType) {
  const [open, setOpen] = useState(props.open);

  return (
    <div>
        <div className="rounded col-span-4 border bg-white border-gray-primary mb-12" data-testid={"post" + props.id}  >
        <Header username = {props.username} avatar={props.avatar} time_created={props.time_created} whether_followed_post_user={props.whether_followed_post_user}/>
        <Image mediaList={props.mediaList} caption="images" />
        <Actions post_id={props.id} whether_liked={props.whether_liked} whether_saved={props.whether_saved} likes={props.likes} onComment={() => setOpen(true)}/>
        <Footer username={props.username} caption={props.caption} />
        <Comments comments={props.comments} onExpandComments={() => setOpen(true)}/>
        <AddComment id={props.id} username={props.username} onCreateComment={props.onCreateComment} avatar={props.avatar} replyUser="" commentId=""/>
        <Modal id={props.id} open={open} username = {props.username} caption={props.caption} whether_liked={props.whether_liked} whether_saved={props.whether_saved} whether_followed_post_user={props.whether_followed_post_user} likes={props.likes} avatar={props.avatar} time_created={props.time_created} comments={props.comments} mediaList={props.mediaList} onClose={() => setOpen(false)} onCreateComment={props.onCreateComment}/>
        </div>
    </div>
  )
}
