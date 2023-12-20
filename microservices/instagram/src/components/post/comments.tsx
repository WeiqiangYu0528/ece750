import React from 'react'
import { postComments, postComment } from './postType'
import { formatDistanceToNowStrict } from 'date-fns'

export default function Comments(props:postComments) {
  return (
    <div className="px-4 pt-1">
      {props.comments && props.comments.slice(0,3).map((comment:postComment, inx) => {
        return (
          <div key={comment.id}>
              <p className='mb-1'>
                  <span data-testid={"name"+comment.id} className='mr-1 font-bold'>{comment.username}</span>
                  <span data-testid={"comment"+comment.id} >{comment.comment}</span>
              </p>
          </div>
        )
      })}
      <p className="text-sm text-gray mb-1 cursor-pointer" data-testid="expand-comment" onClick={props.onExpandComments}>View all {props.comments?.length} comments</p>
    </div>
  )
}
