/**
 * 
 */
package com.fkj.weixintest.controller;

import javax.annotation.Resource;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.fkj.weixintest.bean.po.System;
import com.fkj.weixintest.service.SystemService;
import com.fkj.weixintest.spring.bean.RetResult;
import com.fkj.weixintest.util.LoggerHelper;
import com.fkj.weixintest.util.MergeTool;

/**
 * @author kejingfeng
 *
 */
@RestController
@RequestMapping(value = "/system")
public class SystemController {
    
    @Resource
    private SystemService systemService;
    
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public ModelAndView list() {
        return new ModelAndView("system/list");
    }
    
    @RequestMapping(value = "/page", method = RequestMethod.GET)
    public @ResponseBody Page<System> search(@ModelAttribute System qry, Pageable paged) {   
        
        return systemService.findAll(qry, paged );
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public @ResponseBody System find(@PathVariable Integer id) {
        return systemService.findOne( id );
    }
    
    @RequestMapping(value = "/", method = RequestMethod.POST)
    public @ResponseBody RetResult save(@ModelAttribute System obj) {
    	try{
        	systemService.save(obj);
        }catch (Exception e) {
            LoggerHelper.err(getClass(), "save obj error ", e);
            return new RetResult(-1, e.getMessage());
        }
        return new RetResult(0, "success");
        
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public @ResponseBody RetResult save(@PathVariable Integer id, @ModelAttribute System obj) {
    	System updateObj = systemService.findOne(id);
        MergeTool.mergeOriginNotNullPropertiesToTarget(obj, updateObj);
        try{
        	systemService.save(updateObj);
        }catch (Exception e) {
            LoggerHelper.err(getClass(), "update obj error ", e);
            return new RetResult(-1, e.getMessage());
        }
        return new RetResult(0, "success");
    }
    
    @RequestMapping(value = "/del/{id}", method = RequestMethod.GET)
    public @ResponseBody RetResult del(@PathVariable Integer id) {
    	try{
        	systemService.del(id);
        }catch (Exception e) {
            LoggerHelper.err(getClass(), "del obj error ", e);
            return new RetResult(-1, e.getMessage());
        }
        return new RetResult(0, "success");
    }

}
