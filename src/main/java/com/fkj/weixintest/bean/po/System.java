package com.fkj.weixintest.bean.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import org.apache.commons.lang.builder.ReflectionToStringBuilder;


/**
 * The persistent class for the system database table.
 * 
 */
@Entity
@Table(name="system")
@NamedQuery(name="System.findAll", query="SELECT t FROM System t")
public class System implements Serializable{
	private static final long serialVersionUID = 3354341733320420204L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id")
	private Integer id ;
	
	@Column(name="name")
	private String name ;
	
	@Column(name="comment")
	private String comment ;

	public Integer getId() 
	{
		return this.id;
	}
	
	public void setId(Integer id) 
	{
		this.id=id;
	}

	public String getName() 
	{
		return this.name;
	}
	
	public void setName(String name) 
	{
		this.name=name;
	}

	public String getComment() 
	{
		return this.comment;
	}
	
	public void setComment(String comment) 
	{
		this.comment=comment;
	}


    @Override
    public String toString()
    {
        return ReflectionToStringBuilder.toString(this);
    }
}
