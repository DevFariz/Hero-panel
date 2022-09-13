import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {v4 as uuidv4} from "uuid";
import { heroCreated } from "../heroesList/heroesSlice";
import {useHttp} from "../../hooks/http.hook";
import Spinner from "../spinner/Spinner";

const HeroesAddForm = () => {   
    const [heroName, setHeroName] = useState('');
    const [heroDescr, setHeroDescr] = useState('');
    const [heroElement, setHeroElement] = useState('');

    const {request} = useHttp();

    const {filters, filtersLoadingStatus} = useSelector(state => state.filters);
    const dispatch = useDispatch();

    const onSubmitHandler = (e) => {
        e.preventDefault();

        const newHero = {
            id: uuidv4 (),
            name: heroName,
            description: heroDescr,
            element: heroElement
        }

        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(dispatch(heroCreated(newHero)))
            .catch(err => console.log(err));
        
        setHeroName('');
        setHeroDescr('');
        setHeroElement('');
    }

    const renderFilters = (filters, status) => {
        if(status === 'loading'){
            return <option><Spinner /></option>
        } else if(status === 'error'){
            return <option>Ошибка загрузки</option>
        }

        if (filters && filters.length > 0 ) {
            return filters.map(({name, label}) => {
                // Один из фильтров нам тут не нужен
                // eslint-disable-next-line
                if (name === 'all')  return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={onSubmitHandler}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control"
                    onChange={(e) => setHeroName(e.target.value)}
                    value={heroName}
                    id="name" 
                    placeholder="Как меня зовут?"/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control"
                    onChange={(e) => setHeroDescr(e.target.value)}
                    value={heroDescr} 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    onChange={(e) => setHeroElement(e.target.value)}
                    name="element">
                    <option>Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;