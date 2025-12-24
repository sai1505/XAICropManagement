import json
from api.deps import supabase
from core.groq_client import get_groq_client
from services.llm import safe_json_parse

client = get_groq_client()

MAX_CONTEXT = 10

def load_user_chats(user_id: str):
    res = (
        supabase
        .table("user_chats")
        .select("id, title, main_image, updated_at")
        .eq("user_id", user_id)
        .order("updated_at", desc=True)
        .execute()
    )
    return res.data

def resume_chat(chat_id: str, user_id: str):
    res = (
        supabase
        .table("user_chats")
        .select("chat, title, stats, main_image")
        .eq("id", chat_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    return {
        "chat_id": chat_id,
        "conversation": res.data["chat"]
    }

def create_new_chat(user_id: str, user_email: str):
    res = (
        supabase
        .table("user_chats")
        .insert({
            "user_id": user_id,
            "user_email": user_email,
            "chat": []
        })
        .execute()
    )
    return res.data[0]["id"]

def chat_and_continue(chat_id: str, user_id: str, user_message: str):
    # 1. Load chat
    chat = (
        supabase
        .table("user_chats")
        .select("chat")
        .eq("id", chat_id)
        .eq("user_id", user_id)
        .single()
        .execute()
        .data["chat"]
    )

    # 2. Append user message
    chat.append({
        "role": "user",
        "content": user_message
    })

    # 3. Send last N messages to LLM
    context = chat[-MAX_CONTEXT:]

    messages = [
        {
            "role": m["role"],
            "content": (
                json.dumps(m["content"])
                if isinstance(m["content"], dict)
                else m["content"]
            )
        }
        for m in context
    ]

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.3,
        max_tokens=800
    )

    assistant_reply = safe_json_parse(
        completion.choices[0].message.content
    )

    # 4. Append assistant reply
    chat.append({
        "role": "assistant",
        "content": assistant_reply
    })

    # 5. Save
    supabase.table("user_chats") \
        .update({ "chat": chat }) \
        .eq("id", chat_id) \
        .execute()

    return {
        "chat_id": chat_id,
        "conversation": chat
    }

