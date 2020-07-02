import React from "react";

type SearchFunction = (title: string) => Promise<void>;

interface SearchBoxParams {
    search: SearchFunction;
}

export const SearchBox = ({search}: SearchBoxParams) => {
    const [title, updateTitle] = React.useState("");
    const [enabled, setEnabled] = React.useState(true)

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (enabled) {
            setEnabled(false)
            search(title).finally(() => setEnabled(true));
        }
    }
    return <div>
        <form onSubmit={handleSubmit}>
            <h2>Movie Title</h2>
            <label htmlFor="title">Movie Title</label>
            <input alt="Movie Title" name="title" type="text" value={title} onChange={(
                ev: React.ChangeEvent<HTMLInputElement>,
            ): void => updateTitle(ev.target.value)} disabled={!enabled}/>

            <input type="submit" value="Submit"/>
        </form>
    </div>
}