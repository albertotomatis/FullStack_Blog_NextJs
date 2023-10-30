'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from "next-auth/react";

export default function CreatePostForm() {
    const { data: session } = useSession();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });

    const id_author = session?.user?.id;
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('api/topic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, id_author }),
            });

            if (res.ok) {
                const form = e.target;
                form.reset();
                setShowSuccessToast(true);
            } else {
                console.log('Create post failed.');
            }
        } catch (error) {
            console.error('Error during post creation:', error);
        }
    };

    useEffect(() => {
        if (showSuccessToast) {
            toast.success('Post created successfully.');
            setShowSuccessToast(false); // Reset the success flag
        }
    }, [showSuccessToast]);

    return (
    <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-[#51A6DB]">
            Crea un post
            </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
            <label htmlFor="title" className="block text-sm font-bold leading-6 text-gray-900 px-2.5">
            Title
            </label>    
                <input type="text" id="title" onChange={handleChange} name="title"
                className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-900 sm:text-sm sm:leading-6"
                />
            </div>
            <div>
            <label htmlFor="content" className="block text-sm font-bold leading-6 text-gray-900 px-2.5">
            Content
            </label>  
                <textarea id="content" onChange={handleChange} name="content"
                className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-900 sm:text-sm sm:leading-6"
                />
            </div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-[#ffbc5f] px-3 py-1.5 text-sm font-semibold leading-6 text-slate-900 hover:bg-[#51A6DB]"
              style={{
                borderBottom: '4px solid #020202',
                borderLeft: '4px solid #020202',
                borderTop: '1px solid #020202',
                borderRight: '1px solid #020202',
              }}>
              Create
            </button>
        </form>
        </div>
    </div>

    );
    }

