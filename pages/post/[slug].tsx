import { GetStaticProps } from 'next'
import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import PortableText from 'react-portable-text'
import { SubmitHandler } from 'react-hook-form'
import Nav from '../../components/Nav'

interface Props {
   post: Post
}

interface FormInput {
   _id: string
   name: string
   email: string
   comment: string
}

const Post = ({post}: Props) => {
   const [submitted, setSubmitted] = useState(false)

   const {
      register, 
      handleSubmit, 
      formState:{
         errors
      }
   } = useForm<FormInput>()

   const onSubmit:SubmitHandler<FormInput> = async (data)=>{
      await fetch('/api/createComment', {
         method: 'POST',
         body: JSON.stringify(data)
      }).then(()=>{
         setSubmitted(true)
      }).catch(()=>{
         setSubmitted(false)
      })
   }

   return (
      <main>
         <Nav />
         <img className='w-full h-40 object-cover' src={urlFor(post.mainImage).url()!} alt="" />
         <article className='max-w-3xl mx-auto p-5'>
            <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
            <h2 className='text-xl font-light text-gray-500 mb-2'>{post.description}</h2>
            <div className='flex items-center space-x-2'>
               <img className='h-10 w-10 object-cover rounded-full' src={urlFor(post.author.image).url()!} alt="" />
               <p className='font-extralight text-sm'>
                  Blog post by <span className='text-green-600'>{post.author.name}</span> - Published at {new Date(post._createdAt).toLocaleString()}
               </p>
            </div>
            <div className='mt-10'>
               <PortableText 
                  dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                  projectId={"453nv31x"!}
                  content={post.body}
                  serializers={
                     {
                        h1: (props: any) => (
                           <h1 className='text-2xl font-bold my-5' {...props}></h1>
                        ),
                        h2: (props: any) => (
                           <h2 className='text-xl font-bold my-5' {...props}></h2>
                        ),
                        li: ({children}:any) => (
                           <li className='ml-4 list-disc'>
                              {children}
                           </li>
                        ),
                        link: ({children, href}: any) => (
                           <a href={href} className='text-blue-500 hover:underline'>
                              {children}
                           </a>
                        ),
                     }
                  }
               />
            </div>
         </article>
         <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />
         {submitted ? (
            <div className='flex flex-col p-10 bg-yellow-500 text-white max-w-2xl mx-auto'>
               <h3 className='text-3xl font-bold'>
                  Thank you for submitting your comment!
               </h3>
               <p>
                  Once it has been approved, it will appear below!
               </p>
            </div>
         ) :( <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-5 max-w-2xl mb-10 mx-auto'>
            <h3 className='text-sm text-yellow-500'>Enjoyed this article?</h3>
            <h4 className='text-3xl font-bold'>Leave a comment below!</h4>
            <hr className='py-3 mt-2'/>
            <input 
               type="hidden" 
               {...register("_id")} 
               name="_id" 
               value={post._id}
            />
            <label className='block mb-5'>
               <span className='text-gray-700'>Name</span>
               <input 
                  className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring' 
                  placeholder='John Appleseed' 
                  type="text" 
                  {...register("name", {required: true})}
                  />
            </label>
            <label className='block mb-5'>
               <span className='text-gray-700'>Email</span>
               <input 
                  className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring' 
                  placeholder='John Appleseed' 
                  type="text" 
                  {...register("email", {required: true})}
                  />
            </label>
            <label className='block mb-5'>
               <span className='text-gray-700'>Comment</span>
               <textarea 
                  className='shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring' 
                  placeholder='John Appleseed' 
                  rows={8} 
                  {...register("comment", {required: true})}
               />
            </label>
            <div className='flex flex-col p-5'>
               {errors.name &&(
                  <span className='text-red-500'>The Name Field is required</span>
               )}
               {errors.comment &&(
                  <span className='text-red-500'>The Comment Field is required</span>
               )}
               {errors.email &&(
                  <span className='text-red-500'>The Email Field is required</span>
               )}
            </div>
            <input type="submit" className='shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer' />
         </form>)}
         {/* Comments */}
         <div
        className="flex flex-col p-10 my-10 max-w-2xl mx-auto
        shadow-green-400 rounded-sm shadow space-y-2
          "
      >
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />

        {post.comments.map((comment) => (
          <div key={comment._id} className="">
            <p className="">
              <span className="text-blue-500">{comment.name}:</span>
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
         
      </main>
   )
}

export const getStaticPaths = async () => {
   const query = `
      *[_type == "post"]{
         _id,
         slug{
            current
         }
      }
   `

   const posts: Post[] = await sanityClient.fetch(query)

   const paths = posts.map(post => ({
      params: {
         slug: post.slug.current
      }
   }))

   return {
      paths,
      fallback: 'blocking'
   }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
   const query = `*[_type == "post" && slug.current == $slug][0]{
      _id,
      _createdAt,
      title,
      author-> {
         name,
         image
      },
      'comments': *[
         _type == "comment" &&
         post._ref == ^._id &&
         approved == true
      ],
      description,
      mainImage,
      body,
      slug
   }`

   const post = await sanityClient.fetch(query, {slug: params?.slug}) 

   if(!post){
      return {
         notFound: true
      }
   }
   return {
      props: {post},
      revalidate: 60
   }
}

export default Post