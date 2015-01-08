package com.fkj.weixintest.jpa;

import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

public class WsdPageImpl<T> extends PageImpl<T> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8069775119152817784L;

	public WsdPageImpl(List<T> content, Pageable pageable, long total) {

		super(content, pageable, total);
	}

	/**
	 * Creates a new {@link PageImpl} with the given content. This will result in the created {@link Page} being identical
	 * to the entire {@link List}.
	 * 
	 * @param content must not be {@literal null}.
	 */
	public WsdPageImpl(List<T> content) {
		super(content);
	}

	public long getPageTotal() {
		return super.getTotalElements();
	}
	
	public int getPageCount() {
		return super.getTotalPages();
	}
	
	public long getPageNo(){
		return super.getNumber()+1;
	}

	public long getPageSize(){
		return super.getSize();
	}
	
	public List<T> getList(){
		return super.getContent();
	}
	
	@JsonIgnore
	public List<T> getContent(){
		return super.getContent();
	}
}
