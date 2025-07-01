package main.java.com.vetgo.api.service;

import java.util.List;

public interface ICrudService<T> {
    
    public List<T> get(String termoBusca);
    public T get(Long id);
    public T save(T objeto);
    public void delete(Long id);

}